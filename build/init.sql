create table account
(
    id         varchar(64)                         not null
        primary key,
    fullname   varchar(64)                         not null,
    email      varchar(64)                         not null,
    type       enum ('common', 'shopkeeper')       not null,
    cpf        varchar(64)                         null,
    cnpj       varchar(64)                         null,
    balance    double    default 1000              not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp                           null,
    constraint account_cnpj_uindex
        unique (cnpj),
    constraint account_cpf_uindex
        unique (cpf),
    constraint account_email_uindex
        unique (email)
);

create table transaction
(
    id          varchar(64)                                           not null
        primary key,
    sender_id   varchar(64)                                           not null,
    receiver_id varchar(64)                                           not null,
    amount      double                                                not null,
    status      enum ('waiting', 'processing', 'completed', 'failed') null,
    created_at  timestamp default CURRENT_TIMESTAMP                   not null,
    updated_at  timestamp                                             null,
    constraint transaction_account_id_fk
        foreign key (sender_id) references account (id),
    constraint transaction_account_id_fk_2
        foreign key (receiver_id) references account (id)
);



