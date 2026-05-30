--
-- PostgreSQL database dump
--

\restrict PzIc1ADBdTXaQAQ83bOv8gHi29Bfbv3q0hsDNx9v3fyDlBzK0OStJDUzsUZugqN

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_jwt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_jwt (
    id_jwt integer NOT NULL,
    id_admin integer NOT NULL,
    token character varying(300)
);


ALTER TABLE public.admin_jwt OWNER TO postgres;

--
-- Name: admin_jwt_id_jwt_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_jwt_id_jwt_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_jwt_id_jwt_seq OWNER TO postgres;

--
-- Name: admin_jwt_id_jwt_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_jwt_id_jwt_seq OWNED BY public.admin_jwt.id_jwt;


--
-- Name: adminusers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adminusers (
    id_admin integer NOT NULL,
    fio character varying(100),
    login character varying(100),
    passhash character varying(300),
    roles character varying(30)
);


ALTER TABLE public.adminusers OWNER TO postgres;

--
-- Name: adminusers_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adminusers_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adminusers_id_admin_seq OWNER TO postgres;

--
-- Name: adminusers_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adminusers_id_admin_seq OWNED BY public.adminusers.id_admin;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.districts (
    id_district integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.districts OWNER TO postgres;

--
-- Name: districts_id_district_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.districts_id_district_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.districts_id_district_seq OWNER TO postgres;

--
-- Name: districts_id_district_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.districts_id_district_seq OWNED BY public.districts.id_district;


--
-- Name: form_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_messages (
    id_message integer NOT NULL,
    form_id integer NOT NULL,
    sender_id integer NOT NULL,
    sender_type character varying(10) NOT NULL,
    message_text text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT form_messages_sender_type_check CHECK (((sender_type)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.form_messages OWNER TO postgres;

--
-- Name: form_messages_id_message_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.form_messages_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_messages_id_message_seq OWNER TO postgres;

--
-- Name: form_messages_id_message_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.form_messages_id_message_seq OWNED BY public.form_messages.id_message;


--
-- Name: forms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forms (
    id_form integer NOT NULL,
    form_type character varying(50) NOT NULL,
    address character varying(200),
    phone character varying(20),
    data text,
    id_user integer NOT NULL,
    id_admin integer,
    status character varying(30) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT forms_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.forms OWNER TO postgres;

--
-- Name: forms_id_form_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forms_id_form_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forms_id_form_seq OWNER TO postgres;

--
-- Name: forms_id_form_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forms_id_form_seq OWNED BY public.forms.id_form;


--
-- Name: outagesoff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outagesoff (
    id_outages integer NOT NULL,
    id_admin integer NOT NULL,
    adress character varying(300),
    date date,
    "time" character varying(50),
    reason character varying(300),
    status character varying(100)
);


ALTER TABLE public.outagesoff OWNER TO postgres;

--
-- Name: outagesoff_id_outages_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.outagesoff_id_outages_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.outagesoff_id_outages_seq OWNER TO postgres;

--
-- Name: outagesoff_id_outages_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.outagesoff_id_outages_seq OWNED BY public.outagesoff.id_outages;


--
-- Name: tariffs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tariffs (
    id_tariff integer NOT NULL,
    period character varying(300),
    iscurrent boolean,
    basis character varying(300),
    population text,
    budget text
);


ALTER TABLE public.tariffs OWNER TO postgres;

--
-- Name: tariffs_id_tariff_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tariffs_id_tariff_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tariffs_id_tariff_seq OWNER TO postgres;

--
-- Name: tariffs_id_tariff_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tariffs_id_tariff_seq OWNED BY public.tariffs.id_tariff;


--
-- Name: user_jwt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_jwt (
    id_jwt integer,
    id_user integer,
    token character varying(300)
);


ALTER TABLE public.user_jwt OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    firstname character varying(100) NOT NULL,
    lastname character varying(100),
    created_at timestamp without time zone,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone character varying(30),
    address text,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    id_district integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO postgres;

--
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- Name: admin_jwt id_jwt; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_jwt ALTER COLUMN id_jwt SET DEFAULT nextval('public.admin_jwt_id_jwt_seq'::regclass);


--
-- Name: adminusers id_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminusers ALTER COLUMN id_admin SET DEFAULT nextval('public.adminusers_id_admin_seq'::regclass);


--
-- Name: districts id_district; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts ALTER COLUMN id_district SET DEFAULT nextval('public.districts_id_district_seq'::regclass);


--
-- Name: form_messages id_message; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_messages ALTER COLUMN id_message SET DEFAULT nextval('public.form_messages_id_message_seq'::regclass);


--
-- Name: forms id_form; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms ALTER COLUMN id_form SET DEFAULT nextval('public.forms_id_form_seq'::regclass);


--
-- Name: outagesoff id_outages; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outagesoff ALTER COLUMN id_outages SET DEFAULT nextval('public.outagesoff_id_outages_seq'::regclass);


--
-- Name: tariffs id_tariff; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tariffs ALTER COLUMN id_tariff SET DEFAULT nextval('public.tariffs_id_tariff_seq'::regclass);


--
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- Data for Name: admin_jwt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_jwt (id_jwt, id_admin, token) FROM stdin;
24	1	4ypicn9Nox3AyNiU5tdwnSO4kXNlAnDeM45OwSC9k9u8NkrxAfGMVVeY84CUHWYCu1zzfzigW5Eyq9r6cZHfpmueCES1S8Y9akSHwwXzjmP1vGKujYssVa_LX-TWpHs0dCaGX5BP-Et2U8UDK2PpdRW3XssihOYnDrrGpe9gZKwUbaAubGun_sXhGQuH1Sb5y9naQkmG1sMm
26	9	OF-law5HIbvfm3jA-Uj-1x-9yUvKqXn5X5Z8ySJdZTkvQULhJV3EByUpDC0ttYZcKr9skAATCK6EyBUykfPwjm4vQLPGrnYK-RXP_OYNjTl5Peesw8Ia2ojbaUKHx7pGPqmsMrTzsCkJhvOX3O_ybzmZMSUn3-Te6sgjzDyvX5YiNeS3UZwYzsNaqfeVfx2llopjfT_seT7D
32	6	1eWx-8RT1q0Tx542viwmPGL4j-8800E-A7JI2JBJiIueSuBn4lV4gBIFKYjEud--B7kMsfzazBfosgi5kFcxiTw3OiJBzaLKve1X8gOXzAwKHT02iltJNl3f4k2lTcda0_FZ26WyJ79to1xbYAZnLr-2Sj7ELoUpC7qj-Ysx4BPUzZXZ4X5GxFzdSKdwoMmG0Aggc9pV7ica
\.


--
-- Data for Name: adminusers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adminusers (id_admin, fio, login, passhash, roles) FROM stdin;
6	TES2T	test	$2a$10$F/NSG7szk.Xh9TmS0mWM9OE39FuSzLGRWV9DimOcSoYm61E9muNAG	admin
9	Александр Владимирович Гулик	superadmin	$2a$10$euwff0n36Q1lqu2w1MYq/eBsyCIZJzISFF8fEvGJBv4MfnEWhJtJm	admin
1	Васек Василий Олегович	test2	$2a$10$E1rVng9gdYVkS64rIpfpkODb2fGnltRAfx165YIDQismmsp6EGyxa	moderator
\.


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.districts (id_district, name, created_at) FROM stdin;
1	Киевский район	2026-03-16 13:51:14.686781
2	Куйбышевский район	2026-03-16 13:51:14.686781
3	Ленинский район	2026-03-16 13:51:14.686781
4	Петровский район	2026-03-16 13:51:14.686781
5	Пролетарский район	2026-03-16 13:51:14.686781
6	Буденновский район	2026-03-16 13:51:14.686781
7	Калининский район	2026-03-16 13:51:14.686781
8	Ворошиловский район	2026-03-16 13:51:14.686781
\.


--
-- Data for Name: form_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_messages (id_message, form_id, sender_id, sender_type, message_text, is_read, created_at) FROM stdin;
4	4	0	admin	123asd	f	2026-03-20 07:24:36.158787
5	4	0	admin	123	f	2026-03-20 08:01:34.722399
6	4	0	admin	qwewqe	f	2026-03-20 08:04:34.32191
7	4	0	admin	pank22222222222222222222222	f	2026-03-20 08:04:43.635547
8	4	0	admin	макс хуета делаем свой мессенджер	f	2026-03-20 08:06:36.794929
9	4	1	user	test	f	2026-03-20 08:14:33.330615
10	28	4	user	qwe	f	2026-05-05 17:50:21.045932
11	29	4	user	b\\n exnex	f	2026-05-05 17:51:03.869843
\.


--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forms (id_form, form_type, address, phone, data, id_user, id_admin, status, created_at, updated_at) FROM stdin;
3	emergency	ул. Советская, д. 5, кв. 42	+7 (903) 456-78-90	Отключили электричество во всем доме. Уже 3 часа без света.	2	\N	pending	2024-03-14 09:15:00	2024-03-15 09:30:00
5	emergency	пр. Победы, д. 30, кв. 56	+7 (905) 678-90-12	Не работает лифт, в кабине застряли люди. Требуется срочная помощь.	2	\N	pending	2024-03-15 08:10:00	2024-03-15 08:10:00
6	noheating	ул. Кирова, д. 45, кв. 23	+7 (906) 789-01-23	Холодные батареи во всей квартире. Температура в комнатах +12 градусов.	2	\N	pending	2024-03-15 12:30:00	2024-03-15 12:30:00
7	noheating	ул. Пушкина, д. 8, кв. 15	+7 (907) 890-12-34	Температура в квартире +15 градусов. В детской особенно холодно.	2	\N	pending	2024-03-15 13:45:00	2024-03-15 13:45:00
8	noheating	ул. Лермонтова, д. 12, кв. 34	+7 (908) 901-23-45	Батареи еле теплые, стояк холодный. Соседи жалуются на то же.	2	\N	pending	2024-03-14 16:20:00	2024-03-14 16:20:00
9	noheating	ул. Чехова, д. 7, кв. 91	+7 (909) 012-34-56	Прорвало батарею, заливает соседей снизу. Нужно срочно перекрыть.	2	\N	pending	2024-03-15 09:50:00	2024-03-15 09:50:00
10	noheating	ул. Горького, д. 18, кв. 5	+7 (910) 123-45-67	Шум в системе отопления, гидроудары. Страшно, что прорвет трубы.	2	\N	pending	2024-03-15 07:30:00	2024-03-15 07:30:00
11	nowatter	ул. Комсомольская, д. 22, кв. 17	+7 (911) 234-56-78	Нет холодной воды уже сутки. Весь дом сидит без воды.	2	\N	pending	2024-03-15 11:10:00	2024-03-15 11:10:00
12	nowatter	ул. Октябрьская, д. 9, кв. 33	+7 (912) 345-67-89	Слабый напор воды, еле течет из крана. Невозможно принять душ.	2	\N	pending	2024-03-15 14:50:00	2024-03-15 14:50:00
13	nowatter	ул. Первомайская, д. 14, кв. 7	+7 (913) 456-78-90	Ржавая вода из крана. Нельзя использовать для питья и готовки.	2	\N	pending	2024-03-14 12:40:00	2024-03-14 12:40:00
14	nowatter	ул. Садовая, д. 3, кв. 29	+7 (914) 567-89-01	Течет потолок от соседей сверху. Видимо прорвало трубы.	2	\N	pending	2024-03-15 16:15:00	2024-03-15 16:15:00
15	nowatter	ул. Парковая, д. 11, кв. 44	+7 (915) 678-90-12	Постоянно течет бачок унитаза. Не могу перекрыть воду.	2	\N	pending	2024-03-15 08:45:00	2024-03-15 08:45:00
4	emergency	ул. Гагарина, д. 15, кв. 8	+7 (904) 567-89-01	Прорыв канализации в подвале. Вода поднимается, запах в подъезде.	2	6	completed	2024-03-15 14:20:00	2024-03-15 14:20:00
2	emergency	пр. Мира, д. 25, кв. 12	+7 (902) 345-67-89	Запах газа в подъезде на 5 этаже. Жильцы боятся заходить в подъезд.	2	6	completed	2024-03-15 11:45:00	2024-03-15 11:45:00
1	emergency	ул. Ленина, д. 10, кв. 5	+7 (901) 234-56-78	Прорвало трубу отопления, течет горячая вода. Требуется срочный выезд бригады.	2	6	active	2024-03-15 10:30:00	2024-03-15 10:30:00
16	emergency	123	123	123	4	\N	pending	2026-04-30 12:59:11.383187	2026-04-30 12:59:11.383187
17	nowatter	123	123	123	4	\N	pending	2026-04-30 13:15:24.400617	2026-04-30 13:15:24.400617
18	noheating	123	123	123	4	\N	pending	2026-04-30 13:27:49.569506	2026-04-30 13:27:49.569506
19	noheating	123	123	123	4	\N	pending	2026-04-30 13:37:49.212784	2026-04-30 13:37:49.212784
20	noheating	test123	tesrte	1234w	4	\N	pending	2026-05-05 17:15:15.124172	2026-05-05 17:15:15.124172
21	noheating	123	1231	qwe	4	\N	pending	2026-05-05 17:43:43.311567	2026-05-05 17:43:43.311567
22	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:43:54.802789	2026-05-05 17:43:54.802789
23	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:44:26.426173	2026-05-05 17:44:26.426173
24	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:45:19.263261	2026-05-05 17:45:19.263261
25	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:46:21.881806	2026-05-05 17:46:21.881806
26	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:48:48.702325	2026-05-05 17:48:48.702326
27	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:49:43.873262	2026-05-05 17:49:43.873262
28	noheating	123	7949468273	qwe	4	\N	pending	2026-05-05 17:50:21.043775	2026-05-05 17:50:21.043775
29	noheating	next	7949468273	b\\n exnex	4	\N	pending	2026-05-05 17:51:03.86904	2026-05-05 17:51:03.86904
\.


--
-- Data for Name: outagesoff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outagesoff (id_outages, id_admin, adress, date, "time", reason, status) FROM stdin;
1	1	Ул. Университетская, 10-15	2026-02-12	08:00-20:00	Ремонт магистрали	planned
2	1	ул. Университетская, 10–15	2025-11-08	08:00 – 20:00	Замена теплотрассы	in-progress
3	1	ул. Челюскинцев, 22	2025-11-05	10:00 – 16:00	Профилактика	completed
5	6	tete	2026-03-18	2	21231231	planned
\.


--
-- Data for Name: tariffs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tariffs (id_tariff, period, iscurrent, basis, population, budget) FROM stdin;
1	С 1 июля 2025 г.	t	Постановление РСТ ДНР от 26.11.2024 № 23/6	Тепловая энергия (с прибором учёта): 1 897,71 руб. за 1 Гкал\nОтопление (без прибора): 48,26 руб./м² (отоп. период) или 24,13 руб./м² (год)\nГорячая вода: 127,03 руб. за 1 м³\nПодогрев воды: 102,47 руб. за 1 м³	Тепловая энергия: 4 067,02 руб. за 1 Гкал\nОтопление (без прибора): 99,85 руб./м² (отоп. период)\nГорячая вода: 253,47 руб. за 1 м³
2	С 1 июля 2024 г.	f	Постановление РСТ ДНР от 19.04.2024 № 7/1	Тепловая энергия: 1 495,44 руб. за 1 Гкал\nОтопление: 38,04 руб./м² (отоп. период) или 19,02 руб./м² (год)\nГорячая вода: 100,10 руб. за 1 м³\nПодогрев воды: 80,75 руб. за 1 м³	Тепловая энергия: 3 844,06 руб. за 1 Гкал\nОтопление: 94,38 руб./м² (отоп. период)\nГорячая вода: 239,57 руб. за 1 м³
3	С 1 января 2023 г.	f	Постановление РСТ ДНР от 30.12.2022 №28/4	Тепловая энергия: 1 392,40 руб. за 1 Гкал\nОтопление: 35,42 руб./м² (отоп. период) или 17,71 руб./м² (год)\nГорячая вода: 93,20 руб. за 1 м³\nПодогрев воды: 75,19 руб. за 1 м³	Тепловая энергия: 3 671,50 руб. за 1 Гкал\nОтопление: 90,14 руб./м² (отоп. период)\nГорячая вода: 228,82 руб. за 1 м³
6	123	f	123	123	123
\.


--
-- Data for Name: user_jwt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_jwt (id_jwt, id_user, token) FROM stdin;
\N	3	wU0bQNogmdwCOn5FnAGtC9Llkn77NcJdtliNP5vKbNO5KyqmzlEtBR6JcJOrW_t-Ak2DUj9FEIpLyS-k5UGONs88YQDHuff6_9osnDHJdfih5bRQQf08-xEWYVQ1rTr3fQwqf2LEqH61ZTZN5Ym23naLf1tDZvqnj5tSF93DKFnxkHWF3Ua1e-_aF474jrLGh4mqZiFMpN-L
\N	5	FXozMJxruVubZ1BW7ZYjrXE6sY8ovXwkISFpPrn_yKA8RDFoJ_P-0Ky0TPu_ZrP_XHNHhJvcWw93v8Dtbszq0A0ZGGJkg_rQVyAsiHEQro_hUeJNFIO9cprqDwH20g2k0WjMoqPAfRlMUtPrGidSGtaJaSSUFM42pV7JzetZQ94nDKbobs-0r9Usj9006lS6p3WSBGZ6tkce
\N	6	Y0DxI5CZnNE7_MhoUUVbBpufqSagW--Mxulvt2VdTL8aSJcWHL0VaCrEZgxc9KAL8AjVZdzSnD9_pWc1xKiqzIjgWtU1QJyIwV0YguZcL9G5vKOKGTjnEsiDQ_DnLgaPSvD3HTR6EbrxnmxhsEvw2_JPVKeGEQb5-Fps_DDCsqLzW9At6qqoZ-zkVa1Pwm10nLKKGutNy7lq
\N	7	KRK7NLSeuDF4Vv4DNaKF32dRRU-BAIP5ZdDmGwx1D6xY55D_oCW-EFdK-o1hwvsEf3pt6VMLrbwx-vb0IBHRam0l490ueLJwek6nXVA6MJ_9qdc_4hKH4s0UUUYqtB4DG4DIBILhOlaw02oMVRIeiLMAd1f-IyW0NYc4riLE8ZwHHtojzfVdmgEk-KTk27V6QjyvkckU2wmM
\N	8	M2MULFfMzvDzhXPUCb3bBvYXxgrg-Cr1728SaQpn7zZ_hTzKusrVWGX83pNwQE46SkRMEb7GoMqTqiSy2rT7ztPQ7_mApbxgG2G4srZOn1WKVM81Jst1sawCB0-WnhMMXJP2chJu7xpbzvbdaTML_wLnw9H-gUqt7nDR9R_G50jlmMckLQ8KB_93hdGnOZqiiAj_klKVBhPq
\N	9	z1MJmq7T-wA31XQlQUha_o7y5qvpTRO2u8T2kwe9MO_dn64USZdw2ndcVnMyqVKFlQzsc29KUHPJlj3pxxIvLXUfshQtgCEDePgTp-gFX9Mo8d4E6QP9a3taCBWoBGmXm5psy4jFpTFxJRUUqxyGHcROHLLWDukjfB9AqsEZodOy3y0FOndVEKWOYvQhH8wOZIRFqmPRkQ-A
\N	10	yRa7gx2b0-V4v_kikMmfT9Qfwe2d12A9cgT_9GxXgb9x6qKOGd6hCmh0MlaSSGymGomXCm2IPZdFxLKwOSkBlRLAcDr55mULJJJ3OHjBz0BQuEyoxMwYJ7CAiHTCxMvCDn9RQ3LCkdWbw-5cTcM4PIiIlPAxyx1vfm4spqOOxaW1vUeVVV6eKG8YWwQ0ydgr_wsMlOM9a_qLoTQ=
\N	11	BgVdu6M4FFQif8qD26zPNX3eHdLxPyM9vQzgcuMJYii5XRursEFvIiIDy3yVBVmoZcZmqKQqN0sT732G8fyyaOq0msOZtgMvEO6KQEYmsRncOQg93OicpWZLv4CS_kKgOIVig4uYfg0zjZ4vjysMPsRqtdYInGGZRs7-DQrYVNlFgYfdVcQgNaMGob3ZxEiK5p-_vLVE2LqrC8U=
\N	12	S2OMNCIb2waMlbwIIUAqCemF7oVUUhjAEItzfBVL4I4oD016MjU8yJE3l2UA7fOoXW3PN57kZCIZ5j4L5BK1PbwwKmoUqdRCPJECQb_9z1HR3C9DSIzBa42h96RVfJcjgvm3oijTkoH_qfUFJc6Uue0GDFXcS0YTGR9exBf9R-lBUl1sSJG7dwaTzZfF9b4Bsgl-MTrc8lmusQ4=
\N	13	bXXt8fwKGt7QW7-D-AkxbmvY3p29_-1qioh0613sVnJKzdsURSzgGP_iq-59f7SkMp83z0lumlgy1KTqD3hJpfSL3JxMcK43SDViiYK4hF8-dbNwjoStEdFEGTeGnZsp1OfjzeugvuACfcvQAvgfWqa9r--e_2C6R4YWv3Oc3YIg2EqU9W0KB7dnkZ4J6J0fHeWThTWvtVN-kqw=
\N	14	alPH2WDbODToKSh7leIhN8GK7sEN354x4MPCz5yTXjbMdVBPYS5D1CcjxWNDwvCL2BVQZ7W2bvko37fo8yXsqtelyNA02loZR4uoqcllCvN4CyIbv1OzB4WNzRI7THWTHhYG69MEhikgCaUtVEICWtXjGj1Ki_bLDjy6GqlxPVlKQKcKokE6Wxs4uNamS35rQSApx03YEuxARuQ=
\N	4	u8uT3d_Nfeaf6vbygRageazTvadBz5ZyG0epE9VojhxnJ-yoLlhEBfWZRXTnUPpm2MYnJl5RADEafhcxBXz9KHCSauzV1WKPVMZX1VO9Zkc9CMaRL-xEoGJXsKz20SNXT_AUsWKtIzISdfFWf8Sn4-hH0JYVhswO_ao-Np_Z5E0a6tIh3qqH_Wm_lqgSbqRohwEqzxSmVtXT
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, firstname, lastname, created_at, email, password_hash, phone, address, is_active, last_login, id_district) FROM stdin;
2	Алексей	Петров	2023-01-15 09:00:00	admin@dte.ru	$2a$10$XgJvq5QqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQq	+79001112233	ул. Университетская, 22, каб. 101	t	2024-03-15 08:30:00	1
3	test1234	test1234	2026-04-27 13:26:03.37125	test1234@mail.com	$2a$10$/iRivGKdMrs/NwyIxIjMvOi7qMzPMsHRJYQyy2HKdJPJlyL1jXOOi	79494682873	test1234	t	2026-04-27 13:26:03.37125	1
4	test123	test123	2026-04-27 13:44:48.010137	test123@gmail.com	$2a$10$5yx2p3Xn7wnfml5mt.RTl.ncy.j7xblNk.pLvbybXqGB9S2YPK/q2	79494677783	test123	t	2026-04-27 13:44:48.010137	2
5	test	test	2026-04-27 13:48:53.800476	test@mail.com	$2a$10$PhueuEoVn3XwdHlOvnausOT8aYaExjFZP/H9G6wgwfRgnNKvcgJy2	12345678	12345678	t	2026-04-27 13:48:53.800476	1
6	ivan123	ivan	2026-04-27 13:50:57.571592	ivan@mai.com	$2a$10$D1y3dcAZvJukYA4nI5og4O/ykjkd3JGpcrWD.ujCkV/jGNgmhtc1a	79494682873	ivan@mail.com	t	2026-04-27 13:50:57.571592	1
7	test1234	test1234	2026-04-27 13:53:32.870775	test1234@gmail.com	$2a$10$c9RWUVJbxXtqG2ZTksE2Z.rZeI9UtigqteFf5/1VeQ75C3La23Wsq	test1234	test1234	t	2026-04-27 13:53:32.870776	1
8	tesdt123	tesdt123	2026-04-27 13:55:41.377119	tesdt123@mail.com	$2a$10$F1NofxbW3rsGqItO.xqB3eiaX5vpeQJyeH1l1eGxEsG6T.qqNcu/W	tesdt123@mail.com	tesdt123	t	2026-04-27 13:55:41.37712	6
9	tester123	tester123	2026-04-27 13:57:40.615484	tester123@mail.com	$2a$10$MR0C8pHwePSvR5NqFg3wWeKS36hxr5myybaW08HuDC99sVznHHEV2	tester123	tester123	t	2026-04-27 13:57:40.615484	6
10	test123445	test123445	2026-04-27 13:59:05.545572	test123445@mail.com	$2a$10$mtMjOru.NsA8pB4uuwOh6Oq6PXIUpMqUsExrdpPpz.9nkwNKJLasi	test123445	test123445	t	2026-04-27 13:59:05.545572	8
11	test1234561	test1234561	2026-04-27 14:00:37.782688	test1234561@mail.com	$2a$10$SRbXSQ5vGicjyO6JQDTsMekkG.ECAvGKAn4nFGYV.sF43ZdOUkwHm	test1234561	test1234561	t	2026-04-27 14:00:37.782688	5
12	user123	user123	2026-04-27 14:02:13.649213	user123@mail.com	$2a$10$DgiFQye7ZcBccmcM7ysYH.p.c.mZ2ejQEjjmgxFQMXR5v1rwU.2Ni	user123	user123	t	2026-04-27 14:02:13.649213	4
13	user4321	user4321	2026-04-27 14:03:52.314553	user4321@gmail.com	$2a$10$eIDk/QpeSC16WGi.xrtXWeQXZrLJjP0UDkaUbTUI662YloB3.7zXi	user4321	user4321	t	2026-04-27 14:03:52.314553	3
14	test123	test123	2026-04-28 09:15:34.586608	test123@mail.com	$2a$10$cygKK9Vh4gCDU.4cC6Ky5OhGcWiO4s8laA.7eshc9WxAREUXx7BMq	test	test	t	2026-04-28 09:15:34.586608	5
\.


--
-- Name: admin_jwt_id_jwt_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_jwt_id_jwt_seq', 32, true);


--
-- Name: adminusers_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adminusers_id_admin_seq', 9, true);


--
-- Name: districts_id_district_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.districts_id_district_seq', 9, true);


--
-- Name: form_messages_id_message_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.form_messages_id_message_seq', 11, true);


--
-- Name: forms_id_form_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forms_id_form_seq', 29, true);


--
-- Name: outagesoff_id_outages_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.outagesoff_id_outages_seq', 5, true);


--
-- Name: tariffs_id_tariff_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tariffs_id_tariff_seq', 6, true);


--
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_user_seq', 14, true);


--
-- Name: admin_jwt admin_jwt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_jwt
    ADD CONSTRAINT admin_jwt_pkey PRIMARY KEY (id_jwt);


--
-- Name: adminusers adminusers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adminusers
    ADD CONSTRAINT adminusers_pkey PRIMARY KEY (id_admin);


--
-- Name: districts districts_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_name_key UNIQUE (name);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id_district);


--
-- Name: form_messages form_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_messages
    ADD CONSTRAINT form_messages_pkey PRIMARY KEY (id_message);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id_form);


--
-- Name: outagesoff outagesoff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outagesoff
    ADD CONSTRAINT outagesoff_pkey PRIMARY KEY (id_outages);


--
-- Name: tariffs tariffs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tariffs
    ADD CONSTRAINT tariffs_pkey PRIMARY KEY (id_tariff);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- Name: idx_districts_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_districts_name ON public.districts USING btree (name);


--
-- Name: idx_forms_admin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forms_admin ON public.forms USING btree (id_admin) WHERE (id_admin IS NOT NULL);


--
-- Name: idx_forms_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forms_created ON public.forms USING btree (created_at);


--
-- Name: idx_forms_type_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forms_type_status ON public.forms USING btree (form_type, status);


--
-- Name: idx_forms_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_forms_user ON public.forms USING btree (id_user);


--
-- Name: idx_messages_form; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_form ON public.form_messages USING btree (form_id, created_at);


--
-- Name: idx_messages_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_unread ON public.form_messages USING btree (form_id, is_read) WHERE (is_read = false);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_id_district; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_id_district ON public.users USING btree (id_district);


--
-- Name: outagesoff fk_outagesoff_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outagesoff
    ADD CONSTRAINT fk_outagesoff_admin FOREIGN KEY (id_admin) REFERENCES public.adminusers(id_admin) ON DELETE CASCADE;


--
-- Name: admin_jwt fk_token_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_jwt
    ADD CONSTRAINT fk_token_admin FOREIGN KEY (id_admin) REFERENCES public.adminusers(id_admin) ON DELETE CASCADE;


--
-- Name: form_messages form_messages_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_messages
    ADD CONSTRAINT form_messages_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id_form) ON DELETE CASCADE;


--
-- Name: forms forms_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.adminusers(id_admin) ON DELETE SET NULL;


--
-- Name: forms forms_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- Name: user_jwt user_jwt_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_jwt
    ADD CONSTRAINT user_jwt_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user);


--
-- Name: users users_id_district_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_district_fkey FOREIGN KEY (id_district) REFERENCES public.districts(id_district);


--
-- PostgreSQL database dump complete
--

\unrestrict PzIc1ADBdTXaQAQ83bOv8gHi29Bfbv3q0hsDNx9v3fyDlBzK0OStJDUzsUZugqN

