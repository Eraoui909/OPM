-- create accounts table
create table accounts (
    id number default on null to_number(sys_guid(), 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') primary key,
    is_organization_yn varchar2(1) not null default 'N',
    email varchar2(255) not null,
    display_name varchar2(255) not null,
    password varchar2(255) not null,
    bio varchar2(4000),
    created_at timestamp (6) with local time zone default on null localtimestamp
);

-- check constraint
alter table accounts 
add constraint accounts_ck_1
check (is_organization_yn in ('Y', 'N'));

create table packages (
    id number default on null to_number(sys_guid(), 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') primary key,
    package_name varchar2(255) not null,
    account_id number not null,
    latest_version varchar2(255),
    author varchar2(255),
    description_md varchar2(4000),
    dependency_id number,
    created_at timestamp (6) with local time zone default on null localtimestamp
);

alter table packages
add constraint packages_fk_1
foreign key (account_id) references accounts(id);

alter table packages
add constraint packages_fk_2
foreign key (dependency_id) references packages(id);


create table package_versions (
    id number default on null to_number(sys_guid(), 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') primary key,
    package_id number,
    version_struct varchar2(255),
    version varchar2(255),
    sql clob,
    description_md varchar2(4000),
    created_at timestamp (6) with local time zone default on null localtimestamp
);

alter table package_versions
add constraint package_versions_fk_1
foreign key (package_id) references packages(id);

create table downloads (
    id number default on null to_number(sys_guid(), 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') primary key,
    package_id number,
    ip varchar2(255),
    client_info varchar2(255),
    created_at timestamp (6) with local time zone default on null localtimestamp
);

alter table downloads
add constraint downloads_fk_1
foreign key (package_id) references packages(id);

create table package_upgrades (
    id number default on null to_number(sys_guid(), 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') primary key,
    package_id number,
    from_version_struct varchar2(255),
    from_version varchar2(255),
    to_version_struct varchar2(255),
    to_version varchar2(255),
    sql clob,
    created_at timestamp (6) with local time zone default on null localtimestamp
);

alter table package_upgrades
add constraint package_upgrades_fk_1
foreign key (package_id) references packages(id);