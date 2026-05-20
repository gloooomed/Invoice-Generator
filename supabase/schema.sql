create extension if not exists "pgcrypto";

create table if not exists public.invoices (
    id uuid primary key default gen_random_uuid(),
    filename text not null,
    storage_path text not null unique,
    size_bytes bigint not null default 0,
    customer_name text,
    invoice_number text,
    invoice_date text,
    created_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

drop policy if exists "Public can read invoice history" on public.invoices;
create policy "Public can read invoice history"
on public.invoices
for select
to anon
using (true);

insert into storage.buckets (id, name, public)
values ('invoice-pdfs', 'invoice-pdfs', false)
on conflict (id) do update set public = excluded.public;
