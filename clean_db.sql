CREATE TABLE adminusers (
    id_admin SERIAL PRIMARY KEY,
    fio VARCHAR(100),
    login VARCHAR(100),
    passhash VARCHAR(300),
    roles VARCHAR(30)
);

CREATE TABLE districts (
    id_district SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100),
    created_at TIMESTAMP,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    id_district INTEGER REFERENCES districts(id_district)
);

CREATE TABLE forms (
    id_form SERIAL PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL,
    address VARCHAR(200),
    phone VARCHAR(20),
    data TEXT,
    id_user INTEGER NOT NULL REFERENCES users(id_user),
    id_admin INTEGER REFERENCES adminusers(id_admin),
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE form_messages (
    id_message SERIAL PRIMARY KEY,
    form_id INTEGER NOT NULL REFERENCES forms(id_form),
    sender_id INTEGER NOT NULL,
    sender_type VARCHAR(10) NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outagesoff (
    id_outages SERIAL PRIMARY KEY,
    id_admin INTEGER NOT NULL REFERENCES adminusers(id_admin),
    adress VARCHAR(300),
    date DATE,
    time VARCHAR(50),
    reason VARCHAR(300),
    status VARCHAR(100)
);

CREATE TABLE tariffs (
    id_tariff SERIAL PRIMARY KEY,
    period VARCHAR(300),
    iscurrent BOOLEAN,
    basis VARCHAR(300),
    population TEXT,
    budget TEXT
);

CREATE TABLE admin_jwt (
    id_jwt SERIAL PRIMARY KEY,
    id_admin INTEGER NOT NULL REFERENCES adminusers(id_admin),
    token VARCHAR(300)
);

CREATE TABLE user_jwt (
    id_jwt SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL REFERENCES users(id_user),
    token VARCHAR(300)
);

-- Вставляем данные
INSERT INTO adminusers (id_admin, fio, login, passhash, roles) VALUES 
(1, 'Васек Василий Олегович', 'test2', '$2a$10$E1rVng9gdYVkS64rIpfpkODb2fGnltRAfx165YIDQismmsp6EGyxa', 'moderator'),
(6, 'TES2T', 'test', '$2a$10$F/NSG7szk.Xh9TmS0mWM9OE39FuSzLGRWV9DimOcSoYm61E9muNAG', 'admin'),
(9, 'Александр Владимирович Гулик', 'superadmin', '$2a$10$euwff0n36Q1lqu2w1MYq/eBsyCIZJzISFF8fEvGJBv4MfnEWhJtJm', 'admin')
ON CONFLICT (id_admin) DO NOTHING;

INSERT INTO districts (id_district, name, created_at) VALUES 
(1, 'Киевский район', '2026-03-16 13:51:14.686781'),
(2, 'Куйбышевский район', '2026-03-16 13:51:14.686781'),
(3, 'Ленинский район', '2026-03-16 13:51:14.686781'),
(4, 'Петровский район', '2026-03-16 13:51:14.686781'),
(5, 'Пролетарский район', '2026-03-16 13:51:14.686781'),
(6, 'Буденновский район', '2026-03-16 13:51:14.686781'),
(7, 'Калининский район', '2026-03-16 13:51:14.686781'),
(8, 'Ворошиловский район', '2026-03-16 13:51:14.686781')
ON CONFLICT (id_district) DO NOTHING;

INSERT INTO users (id_user, firstname, lastname, created_at, email, password_hash, phone, address, is_active, last_login, id_district) VALUES 
(2, 'Алексей', 'Петров', '2023-01-15 09:00:00', 'admin@dte.ru', '$2a$10$XgJvq5QqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQq', '+79001112233', 'ул. Университетская, 22, каб. 101', true, '2024-03-15 08:30:00', 1),
(3, 'test1234', 'test1234', '2026-04-27 13:26:03.37125', 'test1234@mail.com', '$2a$10$/iRivGKdMrs/NwyIxIjMvOi7qMzPMsHRJYQyy2HKdJPJlyL1jXOOi', '79494682873', 'test1234', true, '2026-04-27 13:26:03.37125', 1),
(4, 'test123', 'test123', '2026-04-27 13:44:48.010137', 'test123@gmail.com', '$2a$10$5yx2p3Xn7wnfml5mt.RTl.ncy.j7xblNk.pLvbybXqGB9S2YPK/q2', '79494677783', 'test123', true, '2026-04-27 13:44:48.010137', 2),
(5, 'test', 'test', '2026-04-27 13:48:53.800476', 'test@mail.com', '$2a$10$PhueuEoVn3XwdHlOvnausOT8aYaExjFZP/H9G6wgwfRgnNKvcgJy2', '12345678', '12345678', true, '2026-04-27 13:48:53.800476', 1),
(6, 'ivan123', 'ivan', '2026-04-27 13:50:57.571592', 'ivan@mai.com', '$2a$10$D1y3dcAZvJukYA4nI5og4O/ykjkd3JGpcrWD.ujCkV/jGNgmhtc1a', '79494682873', 'ivan@mail.com', true, '2026-04-27 13:50:57.571592', 1),
(7, 'test1234', 'test1234', '2026-04-27 13:53:32.870775', 'test1234@gmail.com', '$2a$10$c9RWUVJbxXtqG2ZTksE2Z.rZeI9UtigqteFf5/1VeQ75C3La23Wsq', 'test1234', 'test1234', true, '2026-04-27 13:53:32.870776', 1),
(8, 'tesdt123', 'tesdt123', '2026-04-27 13:55:41.377119', 'tesdt123@mail.com', '$2a$10$F1NofxbW3rsGqItO.xqB3eiaX5vpeQJyeH1l1eGxEsG6T.qqNcu/W', 'tesdt123@mail.com', 'tesdt123', true, '2026-04-27 13:55:41.37712', 6),
(9, 'tester123', 'tester123', '2026-04-27 13:57:40.615484', 'tester123@mail.com', '$2a$10$MR0C8pHwePSvR5NqFg3wWeKS36hxr5myybaW08HuDC99sVznHHEV2', 'tester123', 'tester123', true, '2026-04-27 13:57:40.615484', 6),
(10, 'test123445', 'test123445', '2026-04-27 13:59:05.545572', 'test123445@mail.com', '$2a$10$mtMjOru.NsA8pB4uuwOh6Oq6PXIUpMqUsExrdpPpz.9nkwNKJLasi', 'test123445', 'test123445', true, '2026-04-27 13:59:05.545572', 8),
(11, 'test1234561', 'test1234561', '2026-04-27 14:00:37.782688', 'test1234561@mail.com', '$2a$10$SRbXSQ5vGicjyO6JQDTsMekkG.ECAvGKAn4nFGYV.sF43ZdOUkwHm', 'test1234561', 'test1234561', true, '2026-04-27 14:00:37.782688', 5),
(12, 'user123', 'user123', '2026-04-27 14:02:13.649213', 'user123@mail.com', '$2a$10$DgiFQye7ZcBccmcM7ysYH.p.c.mZ2ejQEjjmgxFQMXR5v1rwU.2Ni', 'user123', 'user123', true, '2026-04-27 14:02:13.649213', 4),
(13, 'user4321', 'user4321', '2026-04-27 14:03:52.314553', 'user4321@gmail.com', '$2a$10$eIDk/QpeSC16WGi.xrtXWeQXZrLJjP0UDkaUbTUI662YloB3.7zXi', 'user4321', 'user4321', true, '2026-04-27 14:03:52.314553', 3),
(14, 'test123', 'test123', '2026-04-28 09:15:34.586608', 'test123@mail.com', '$2a$10$cygKK9Vh4gCDU.4cC6Ky5OhGcWiO4s8laA.7eshc9WxAREUXx7BMq', 'test', 'test', true, '2026-04-28 09:15:34.586608', 5)
ON CONFLICT (id_user) DO NOTHING;

INSERT INTO admin_jwt (id_jwt, id_admin, token) VALUES 
(24, 1, '4ypicn9Nox3AyNiU5tdwnSO4kXNlAnDeM45OwSC9k9u8NkrxAfGMVVeY84CUHWYCu1zzfzigW5Eyq9r6cZHfpmueCES1S8Y9akSHwwXzjmP1vGKujYssVa_LX-TWpHs0dCaGX5BP-Et2U8UDK2PpdRW3XssihOYnDrrGpe9gZKwUbaAubGun_sXhGQuH1Sb5y9naQkmG1sMm'),
(26, 9, 'OF-law5HIbvfm3jA-Uj-1x-9yUvKqXn5X5Z8ySJdZTkvQULhJV3EByUpDC0ttYZcKr9skAATCK6EyBUykfPwjm4vQLPGrnYK-RXP_OYNjTl5Peesw8Ia2ojbaUKHx7pGPqmsMrTzsCkJhvOX3O_ybzmZMSUn3-Te6sgjzDyvX5YiNeS3UZwYzsNaqfeVfx2llopjfT_seT7D'),
(32, 6, '1eWx-8RT1q0Tx542viwmPGL4j-8800E-A7JI2JBJiIueSuBn4lV4gBIFKYjEud--B7kMsfzazBfosgi5kFcxiTw3OiJBzaLKve1X8gOXzAwKHT02iltJNl3f4k2lTcda0_FZ26WyJ79to1xbYAZnLr-2Sj7ELoUpC7qj-Ysx4BPUzZXZ4X5GxFzdSKdwoMmG0Aggc9pV7ica')
ON CONFLICT (id_jwt) DO NOTHING;

-- Показать все таблицы
\dt
