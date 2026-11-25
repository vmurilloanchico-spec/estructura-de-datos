begin;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (length(trim(title)) between 1 and 160),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists tasks_owner_date on public.tasks(user_id, created_at desc);
alter table public.tasks enable row level security;
revoke all on public.tasks from public, anon, authenticated;
grant select, delete on public.tasks to authenticated;
grant insert(title), update(title, completed) on public.tasks to authenticated;

drop policy if exists own_tasks on public.tasks;
create policy own_tasks on public.tasks for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit,
allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists own_avatar on storage.objects;
create policy own_avatar on storage.objects for all to authenticated
using (bucket_id='avatars' and name=(select auth.uid())::text || '/avatar')
with check (bucket_id='avatars' and name=(select auth.uid())::text || '/avatar');

drop policy if exists own_task_notifications on realtime.messages;
create policy own_task_notifications on realtime.messages for select to authenticated
using (extension='broadcast' and (select realtime.topic())='tasks:' || (select auth.uid())::text);

create or replace function public.notify_task_owner() returns trigger
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid;
begin
  if TG_OP='DELETE' then owner_id := OLD.user_id;
  else owner_id := NEW.user_id;
  end if;
  perform realtime.send('{}'::jsonb, 'changed', 'tasks:' || owner_id::text, true);
  return null;
end;
$$;
revoke all on function public.notify_task_owner() from public, anon, authenticated;
drop trigger if exists task_changed on public.tasks;
create trigger task_changed after insert or update or delete on public.tasks
for each row execute function public.notify_task_owner();

commit;
