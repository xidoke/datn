--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

-- Started on 2025-01-02 17:58:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 68186)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 895 (class 1247 OID 68456)
-- Name: WorkspaceRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkspaceRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER'
);


ALTER TYPE public."WorkspaceRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 68380)
-- Name: FileAsset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FileAsset" (
    id text NOT NULL,
    asset text NOT NULL,
    size integer NOT NULL,
    attributes jsonb NOT NULL,
    "entityType" text NOT NULL,
    "isUploaded" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "storageMetadata" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "workspaceId" text NOT NULL,
    "createdById" text NOT NULL,
    "userId" text,
    "projectId" text,
    "issueId" text
);


ALTER TABLE public."FileAsset" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 68510)
-- Name: Label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Label" (
    id text NOT NULL,
    name text NOT NULL,
    color text NOT NULL,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Label" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 68435)
-- Name: State; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."State" (
    id text NOT NULL,
    name text NOT NULL,
    color text NOT NULL,
    "group" text NOT NULL,
    "projectId" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text
);


ALTER TABLE public."State" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 68421)
-- Name: WorkspaceInvitation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkspaceInvitation" (
    id text NOT NULL,
    email text NOT NULL,
    status text NOT NULL,
    "workspaceId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."WorkspaceRole" DEFAULT 'MEMBER'::public."WorkspaceRole" NOT NULL
);


ALTER TABLE public."WorkspaceInvitation" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 68282)
-- Name: _IssueToLabel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_IssueToLabel" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_IssueToLabel" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 68187)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 68548)
-- Name: cycles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cycles (
    id text NOT NULL,
    description text,
    "startDate" timestamp(3) without time zone,
    "dueDate" timestamp(3) without time zone,
    "projectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    "creatorId" text NOT NULL
);


ALTER TABLE public.cycles OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 68258)
-- Name: issue_assignees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issue_assignees (
    id text NOT NULL,
    "issueId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "memberId" text NOT NULL,
    "workspaceId" text NOT NULL
);


ALTER TABLE public.issue_assignees OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 68250)
-- Name: issue_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issue_comments (
    id text NOT NULL,
    content text NOT NULL,
    "issueId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.issue_comments OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 68242)
-- Name: issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issues (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "stateId" text NOT NULL,
    "projectId" text NOT NULL,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    priority integer DEFAULT 0 NOT NULL,
    "sequenceNumber" integer NOT NULL,
    "cycleId" text,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public.issues OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 68225)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "workspaceId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastIssueNumber" integer DEFAULT 0 NOT NULL,
    token character varying(5) NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 68196)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "cognitoId" text NOT NULL,
    "firstName" text,
    "lastName" text,
    "avatarUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role text DEFAULT 'USER'::text NOT NULL,
    "lastWorkspaceSlug" text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 68216)
-- Name: workspace_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspace_members (
    id text NOT NULL,
    "userId" text NOT NULL,
    "workspaceId" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."WorkspaceRole" DEFAULT 'MEMBER'::public."WorkspaceRole" NOT NULL
);


ALTER TABLE public.workspace_members OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 68208)
-- Name: workspaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workspaces (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ownerId" text NOT NULL,
    "logoUrl" text
);


ALTER TABLE public.workspaces OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 68380)
-- Dependencies: 226
-- Data for Name: FileAsset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FileAsset" (id, asset, size, attributes, "entityType", "isUploaded", "isDeleted", "storageMetadata", "createdAt", "updatedAt", "deletedAt", "workspaceId", "createdById", "userId", "projectId", "issueId") FROM stdin;
\.


--
-- TOC entry 5008 (class 0 OID 68510)
-- Dependencies: 229
-- Data for Name: Label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Label" (id, name, color, "projectId", "createdAt", "updatedAt") FROM stdin;
d5a630e0-daac-4c87-8c5c-5cb80170c683	Email Marketing	#ffa800	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:39:06.056	2024-12-27 20:39:06.056
f19a6474-30fa-4958-b079-1e7cea3dd387	Security	#9333ea	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:39:27.521	2024-12-27 20:39:27.521
a3b730b3-0569-47cc-b535-4963291536b0	Feature	#4bce97	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:39:36.238	2024-12-27 20:39:36.238
1c2ee987-a8e0-4d71-8693-804532f02460	Bug	#62b0fd	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:39:43.877	2024-12-27 20:39:43.877
74b47ebe-f16a-46f4-a06d-4225369fd26e	UI UX	#666666	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:39:52.581	2024-12-27 20:39:52.581
037729dd-b200-4edb-b54c-b07d497ff612	Landing page	#ff8fab	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:40:51.741	2024-12-27 20:40:51.741
97d355bb-7ee2-471c-9422-bc48f8ae9429	Blog post	#00c7b0	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:40:58.56	2024-12-27 20:40:58.56
99cd967d-53b4-4167-b74f-8fc4214f6e85	Email	#e5484d	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:41:05.029	2024-12-27 20:41:05.029
62a998fe-7e85-4da6-86d9-d4ca5613903a	Content	#ff6b00	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:41:22.708	2024-12-27 20:41:22.708
3da5e065-0039-4de8-9f42-76102bf0402c	Website Analysis	#95a5a6	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:42:42.711	2024-12-27 20:42:42.711
e4b9077a-e467-460a-86a9-87ae8f23dd75	API reference	#0055cc	871c16ad-afd2-453e-8028-ce151b88126b	2024-12-27 20:43:30.292	2024-12-27 20:43:30.292
742f8c21-4f23-4920-bf66-b71047bd547c	Comunication Management	#95a5a6	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:01:50.059	2024-12-30 23:01:50.059
d5ceeaa8-d5ec-4652-8bfc-6a42a464cb79	Design Task	#0055cc	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:01:58.757	2024-12-30 23:01:58.757
b00aa09a-5b05-4bd1-9b65-da80992a886e	Email Marketing	#4bce97	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:02:14.838	2024-12-30 23:02:14.838
3d53b37f-9d34-4133-adde-c1d0327364eb	Print Design	#ff8fab	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:02:24.224	2024-12-30 23:02:24.224
fccb1128-509e-4cdc-9513-ad77a54fc92c	Influencer Marketing	#ff6b00	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:02:33.241	2024-12-30 23:02:33.241
f0c4d677-c023-44f3-9050-617df172f1a7	Client Feedback	#ffa800	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:02:44.558	2024-12-30 23:02:44.558
fd5dfb70-8fae-4bd6-ac41-8362cee595ef	Digital Advertisting	#9333ea	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:02:56.074	2024-12-30 23:02:56.074
3e4178ea-781b-435c-82ec-167301700733	Social Media Management	#00c7b0	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:03:07.269	2024-12-30 23:03:07.269
2c4633eb-1ac6-4faa-a45b-c411c31b1034	Branding trategy	#666666	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:03:28.745	2024-12-30 23:03:28.745
558a90f0-e35e-44e1-bcef-3d1818bb137c	Client Onboarding	#62b0fd	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:03:38.347	2024-12-30 23:03:38.347
ab5513d8-9830-420a-b212-65ce66f1872c	Website Analysis	#e5484d	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:03:47.748	2024-12-30 23:03:47.748
4ca12318-b2b0-4ee4-a5a6-26d988dfe63c	SEO	#00c7b0	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:03:58.307	2024-12-30 23:03:58.307
3b52a7b1-b18b-402c-871e-9ad6e08be9ed	Website Design	#00c7b0	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:04:08.908	2024-12-30 23:04:08.908
e7d0bb2a-6389-4949-9b9c-61f8f232234a	Analytics Management	#9333ea	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:04:22.412	2024-12-30 23:04:22.412
b5239c29-334b-4e1f-a9fc-546478299571	Marketing strategy	#e5484d	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:05:05.861	2024-12-30 23:05:23.659
2bf741a1-959d-4ea2-bb17-0669b04b4228	Market Research	#e5484d	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:05:33.613	2024-12-30 23:05:33.613
a022f3d1-ea4c-4837-b61a-6aad479379d5	Content Creation	#666666	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:05:45.659	2024-12-30 23:05:45.659
a951e5da-02df-41f1-8621-c65401298083	Documentation	#ff8fab	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-30 23:05:56.649	2024-12-30 23:05:56.649
\.


--
-- TOC entry 5007 (class 0 OID 68435)
-- Dependencies: 228
-- Data for Name: State; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."State" (id, name, color, "group", "projectId", "isDefault", "createdAt", "updatedAt", description) FROM stdin;
938d0387-5ebd-4592-824d-f614e71400a3	Backlog	#9333ea	backlog	7adad3f5-0f4b-498e-9d0c-fad46235e706	t	2024-12-19 02:13:31.801	2024-12-19 02:13:31.801	Initial state for new issues
ddf29724-e8d3-4236-ac2c-7c0d86d120a4	Todo	#3b82f6	unstarted	7adad3f5-0f4b-498e-9d0c-fad46235e706	f	2024-12-19 02:13:31.801	2024-12-19 02:13:31.801	Issues to be worked on
f340ed6c-ad36-4449-82f9-9fdd7f0b8213	In Progress	#eab308	started	7adad3f5-0f4b-498e-9d0c-fad46235e706	f	2024-12-19 02:13:31.801	2024-12-19 02:13:31.801	Issues currently being worked on
2317c37e-fd10-486d-a5b8-300e73d35d75	Done	#22c55e	completed	7adad3f5-0f4b-498e-9d0c-fad46235e706	f	2024-12-19 02:13:31.801	2024-12-19 02:13:31.801	Completed issues
6b36bdce-3413-42e1-bd5f-6a8c1b0c1fde	Cancelled	#ef4444	cancelled	7adad3f5-0f4b-498e-9d0c-fad46235e706	f	2024-12-19 02:13:31.801	2024-12-19 02:13:31.801	Cancelled or abandoned issues
1ccf7033-2946-43a1-8c6d-0112bef38baf	Backlog	#9333ea	backlog	1f94832a-7db9-47e9-b3f6-01129d801b06	t	2024-12-25 23:32:44.969	2024-12-25 23:32:44.969	Initial state for new issues
fee754bf-d67f-4b49-abfd-9b9d8855cb61	Todo	#3b82f6	unstarted	1f94832a-7db9-47e9-b3f6-01129d801b06	f	2024-12-25 23:32:44.969	2024-12-25 23:32:44.969	Issues to be worked on
705da01a-cc06-4efe-aac3-c5f928729345	In Progress	#eab308	started	1f94832a-7db9-47e9-b3f6-01129d801b06	f	2024-12-25 23:32:44.969	2024-12-25 23:32:44.969	Issues currently being worked on
59104349-ff08-4ab5-bbe5-660cfc5327d3	Done	#22c55e	completed	1f94832a-7db9-47e9-b3f6-01129d801b06	f	2024-12-25 23:32:44.969	2024-12-25 23:32:44.969	Completed issues
e6b0b4b1-6c0d-4421-84a8-4e3906c79018	Cancelled	#ef4444	cancelled	1f94832a-7db9-47e9-b3f6-01129d801b06	f	2024-12-25 23:32:44.969	2024-12-25 23:32:44.969	Cancelled or abandoned issues
e15c1cab-f9e5-414f-b82e-698c471606e9	Todo	#3b82f6	unstarted	871c16ad-afd2-453e-8028-ce151b88126b	f	2024-12-27 11:46:21.488	2024-12-27 11:46:21.488	Issues to be worked on
480b658d-46ec-4262-abf6-430864650d28	In Progress	#eab308	started	871c16ad-afd2-453e-8028-ce151b88126b	f	2024-12-27 11:46:21.488	2024-12-27 11:46:21.488	Issues currently being worked on
0c26c080-b5f8-46ea-9007-cd34f8854865	Done	#22c55e	completed	871c16ad-afd2-453e-8028-ce151b88126b	f	2024-12-27 11:46:21.488	2024-12-27 11:46:21.488	Completed issues
19db9c8e-da63-43d2-a6a1-40220a628f04	Cancelled	#ef4444	cancelled	871c16ad-afd2-453e-8028-ce151b88126b	f	2024-12-27 11:46:21.488	2024-12-27 11:46:21.488	Cancelled or abandoned issues
cb0a1b3f-af77-479c-88a0-3fe715d2582f	Backlog	#9333ea	backlog	871c16ad-afd2-453e-8028-ce151b88126b	f	2024-12-27 11:46:21.488	2024-12-31 00:34:15.673	Initial state for new issues
6fe735b7-0ac2-4574-905a-ee42c55fffac	Planed	#4bce97	unstarted	871c16ad-afd2-453e-8028-ce151b88126b	t	2024-12-31 00:34:05.227	2024-12-31 00:34:15.673	Test chức năng thêm state
\.


--
-- TOC entry 5006 (class 0 OID 68421)
-- Dependencies: 227
-- Data for Name: WorkspaceInvitation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkspaceInvitation" (id, email, status, "workspaceId", "createdAt", "updatedAt", role) FROM stdin;
2563b78e-92db-4b6c-a957-359d79510b84	member@example.com	PENDING	e70da1b9-357f-42f8-906a-f3d5377dd345	2024-12-27 23:37:21.741	2024-12-27 23:37:21.741	MEMBER
2cafabde-6ea7-4255-b98f-2b25f0451fc8	member@example.com	ACCEPTED	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-19 17:56:14.563	2024-12-30 23:06:42.594	MEMBER
fb55afe2-cf8c-45dc-8010-e2f7522f3f8f	user@example.com	ACCEPTED	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-30 23:08:51.062	2024-12-30 23:08:58.444	ADMIN
99dc0be0-054c-4dbf-88dc-bda5659b9cc3	phamdinhdo@example.com	PENDING	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-31 00:20:23.105	2024-12-31 00:20:37.569	MEMBER
effb460b-f0c5-44af-a5d4-93afb6556c47	test@example.com	PENDING	1cd40189-1c02-449d-8c61-32bbac17433f	2024-12-31 00:52:26.639	2024-12-31 00:52:26.639	MEMBER
f07baf46-5977-4a7a-91af-ac020126caa8	test@example.com	PENDING	15e1744b-cbdf-4a25-9500-37b9bce1a5d7	2024-12-31 00:53:37.511	2024-12-31 00:53:37.511	MEMBER
\.


--
-- TOC entry 5004 (class 0 OID 68282)
-- Dependencies: 225
-- Data for Name: _IssueToLabel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_IssueToLabel" ("A", "B") FROM stdin;
c2ca4621-38f6-4f70-a744-542576e6d9a9	d5ceeaa8-d5ec-4652-8bfc-6a42a464cb79
2418493d-88cf-44f7-a798-cff054368983	3d53b37f-9d34-4133-adde-c1d0327364eb
7d2d2126-c494-475a-8e95-0d7f624caaa5	fccb1128-509e-4cdc-9513-ad77a54fc92c
aeceea6b-73cf-470a-928f-f479f4f09e9f	e7d0bb2a-6389-4949-9b9c-61f8f232234a
9239d4c0-ab23-4c5a-aa98-7b0255f4d9cc	b00aa09a-5b05-4bd1-9b65-da80992a886e
9239d4c0-ab23-4c5a-aa98-7b0255f4d9cc	a022f3d1-ea4c-4837-b61a-6aad479379d5
640dee68-ad6e-4aa1-a429-c6c2fe0875a2	d5ceeaa8-d5ec-4652-8bfc-6a42a464cb79
640dee68-ad6e-4aa1-a429-c6c2fe0875a2	b00aa09a-5b05-4bd1-9b65-da80992a886e
640dee68-ad6e-4aa1-a429-c6c2fe0875a2	f0c4d677-c023-44f3-9050-617df172f1a7
2d388333-d66b-4292-ab9f-d9c0efe62e70	d5ceeaa8-d5ec-4652-8bfc-6a42a464cb79
2d388333-d66b-4292-ab9f-d9c0efe62e70	3d53b37f-9d34-4133-adde-c1d0327364eb
2d388333-d66b-4292-ab9f-d9c0efe62e70	fccb1128-509e-4cdc-9513-ad77a54fc92c
2d388333-d66b-4292-ab9f-d9c0efe62e70	3e4178ea-781b-435c-82ec-167301700733
\.


--
-- TOC entry 4996 (class 0 OID 68187)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
09aa0c03-7f81-44a2-8cea-2a99620d3166	7bd61b8e77c1e92eb0a96d4b0a4b7d7594ba2f2312318cbc62a38b108c64fe56	2024-12-19 08:52:49.354777+07	20241202081634_	\N	\N	2024-12-19 08:52:49.349481+07	1
4a6359a9-d338-4ff1-b757-84bf0145c8d0	96bd1f007e1ed350d025ac457c0c1e98b18b7507cb6e943521b5c46bb078d984	2024-12-19 08:52:48.347052+07	20241030223240_init	\N	\N	2024-12-19 08:52:48.302254+07	1
34b9a579-ad49-4a03-b7cb-c472cad8c854	5a715915d80a9951e02c99b3daca4ba80cdba90279aaba290d64b1e0c7f4bd07	2024-12-19 08:52:48.955701+07	20241120144036_enum_permision	\N	\N	2024-12-19 08:52:48.946109+07	1
9ab1f506-c43a-4c72-a0da-9f0445d35ed1	d462e403b8c4a7ab0b12fa23a9623bb9b88e92c25b0470f6d05f4aae444f576e	2024-12-19 08:52:48.359823+07	20241031002435_init	\N	\N	2024-12-19 08:52:48.350344+07	1
c8f04e1f-fa4f-4201-a62e-18c7e57ecfa9	39489a7babafa2cb6ff0e0527b6dfdaa32c3b6eba795828e97f56b138a219701	2024-12-19 08:52:48.372363+07	20241031103311_add_user_role	\N	\N	2024-12-19 08:52:48.362165+07	1
832ddd16-dae0-40f0-8149-7dc23a3e0c5e	95f36784398d6e29e4afb4b4c2950f556a2e79308173fc6cf4855d75d237ea88	2024-12-19 08:52:49.233298+07	20241126122452_delete_tokenproject_model_issue	\N	\N	2024-12-19 08:52:49.225055+07	1
3bfd17e9-674c-4888-8314-8b7fdc87ea05	1242d2fcca02f6f025f5fa19b788a9be1ba1b1cb26b3804989f9a2607398e830	2024-12-19 08:52:48.606011+07	20241105224229_add_last_workspace_id	\N	\N	2024-12-19 08:52:48.375678+07	1
e5aab259-8878-4a50-a613-7992aed027c2	74ec005409964c116143ae165c7a315b082d41ad396058afb79a78e550d99cd0	2024-12-19 08:52:48.98656+07	20241121095722_delete_project_member	\N	\N	2024-12-19 08:52:48.958586+07	1
22d6b6e0-c548-4b75-868b-b7963dc01e23	5d37319820c91db009e6e603be8cf1bff8c7766670e323a01a72bb9d944605e7	2024-12-19 08:52:48.61705+07	20241105224926_add_last_workspace_slug	\N	\N	2024-12-19 08:52:48.608617+07	1
e008fa92-e652-46fe-a286-65fb1fccb4ec	1cae2d4fb831991a7ad46c3904e3b75b05a94ee7b255389232973c0a4b37b4be	2024-12-19 08:52:48.634942+07	20241108004205_add_owner_id_workspace	\N	\N	2024-12-19 08:52:48.62045+07	1
92908d88-9697-4cc1-8658-0c3b171cc9b9	c2f5fa0190089da3dcf21ff78b657f01e581c6a4cfa15aaf3ca0af528a5cdfea	2024-12-19 08:52:48.656754+07	20241111111608_temp_optional_state_issue	\N	\N	2024-12-19 08:52:48.638314+07	1
c2631245-d548-4e6b-8323-e9cf67537f9a	d32ba21bcbfdde99745e1f5496d7beb81fec4de91bfa10c98949d4a48ba652d6	2024-12-19 08:52:48.999475+07	20241121095837_fix_role_invitation	\N	\N	2024-12-19 08:52:48.989665+07	1
cc910f9b-ea0d-4ad5-9ca9-2d94f8b7cade	54ab2a7be72a2253a8b5be6d35fbd5d5dcbf2538884564f4e381a4615059b60f	2024-12-19 08:52:48.736576+07	20241111155814_file_asset	\N	\N	2024-12-19 08:52:48.660325+07	1
75977180-2b9c-49ef-8225-1c04a3c65319	39c86e95e2071a93e58defa58e0e51151a40f01a76f1dbd711f8d19344adb7c3	2024-12-19 08:52:48.747053+07	20241112042626_add_logo_url	\N	\N	2024-12-19 08:52:48.739021+07	1
32e4afed-4fac-4b00-8a2e-eb35e0c4bf6f	124b601d875db5f5721483050970d167de8abce6a956717aea1d031abeb5c4ae	2024-12-19 08:52:48.779179+07	20241114083909_add_workspace_invitations	\N	\N	2024-12-19 08:52:48.749701+07	1
d417bb41-b683-4486-91f1-432257bf0b8e	66c0e8d650abce6f18c6e1c9f3268b9712d5a96c636ebefeb08e16855e22ede2	2024-12-19 08:52:49.054634+07	20241122171415_add_some_on_delete	\N	\N	2024-12-19 08:52:49.003043+07	1
b9043d03-6d82-4174-b99a-a3d5ef758ed3	610e54cb2b975b135acab6d90147681c2451370c2385e041ca5cf5a622da36fe	2024-12-19 08:52:48.835776+07	20241119094811_edit_state	\N	\N	2024-12-19 08:52:48.782419+07	1
6c32e78f-6edb-4aa2-8ecb-0e83083911d6	0e4058fb53457166cc4dcc7ba4303e510813615a5fc602f37a73badea87ae49e	2024-12-19 08:52:48.883842+07	20241119181913_change_logo_url_name	\N	\N	2024-12-19 08:52:48.840216+07	1
324d89c6-fae5-452d-8cef-86e1889e8718	16254b19d9541380c863e60afd54250706f4abe91a237869e89ea101b50927ad	2024-12-19 08:52:49.295971+07	20241129162142_add_cycle_feature	\N	\N	2024-12-19 08:52:49.236468+07	1
e6bb7c71-1862-443e-b84d-d71353660da0	af4a67c356b1a3cd111c27e830997a9df93e99f62d92fdf8855fccc94d8b4fca	2024-12-19 08:52:48.942618+07	20241120101102_change_workspace_member_add_enum_role	\N	\N	2024-12-19 08:52:48.887329+07	1
e48dc2e0-70fe-4a02-8827-9c8ce6c2073a	c29c729f5a0e0c8eb701dd39082bcfcbf1cbfea7296f6f0dfc7a27c2739856d9	2024-12-19 08:52:49.123535+07	20241126011946_fix_label_unique_for_prj	\N	\N	2024-12-19 08:52:49.057164+07	1
7c810cc8-2eaa-47ac-b546-216d2adc7b74	c2110798dd8771c680a9c26a2fde03be5a380d89082fdef18afbb729cddf399e	2024-12-19 08:52:49.161104+07	20241126050236_add_unique_default_state_constraint	\N	\N	2024-12-19 08:52:49.126139+07	1
1ebf6e67-7b60-4932-bd2c-5e9d8702a59a	c2aba819e32db3ed72414598423728ca79702df52c04b1855b4f116c41734ba4	2024-12-19 09:06:35.903863+07	20241219020635_	\N	\N	2024-12-19 09:06:35.864233+07	1
ffb35b01-6341-40fd-9377-503e67a74883	8a83775c82e3b3320097b16414f8830dcf17c1139c85b2a1c1cb1acf73c8b34f	2024-12-19 08:52:49.179651+07	20241126051128_add_state_default_check_constraint	\N	\N	2024-12-19 08:52:49.16337+07	1
458a4cf7-01c2-463e-a661-53e41accf533	26c815c277933b4274d98e2f68f55af7b8ad3c63a27fa28a713f648275904f0c	2024-12-19 08:52:49.315338+07	20241201003633_ondelete_label_project	\N	\N	2024-12-19 08:52:49.298823+07	1
37374d70-a8e8-4043-8195-1c4b935aecd7	4fe39614d3908a0993a85b6a780f046923053ffb913fe741ce49833e01e9f618	2024-12-19 08:52:49.222064+07	20241126120952_issue_project_token_priority	\N	\N	2024-12-19 08:52:49.181854+07	1
77673575-878c-43a3-adc0-4fa2c98c1ccb	9ef95eeec86c07a8cf1b134511a38965b1dee80e40d2c5b7a96826e6e25edbff	2024-12-19 08:52:49.366618+07	20241203090500_add_start_date_issue	\N	\N	2024-12-19 08:52:49.358065+07	1
893baf74-7279-4fa0-a071-1b356a9ff2f7	5fa3d4a2fbfa0fffdc5dd292afbb2463d90293c7e98237c75fa2ba3139bbbba7	2024-12-19 08:52:49.336179+07	20241201003844_ondelete_state_project	\N	\N	2024-12-19 08:52:49.318045+07	1
678e566d-25df-40f6-b157-0504ba6d7226	a28f72684b45377a31afed14071cbc3d9c686bef7a30c14eca26baa9111b561d	2024-12-19 08:52:49.34786+07	20241202065738_cycle_name_to_title	\N	\N	2024-12-19 08:52:49.339494+07	1
713a69be-e53e-480d-acb7-b489f4c01ff2	06289e129ba71c37508d68d379583c0d23efc4b7694d578be3c59abf977eb553	2024-12-19 08:52:49.414302+07	20241206042708_comment_ondelete	\N	\N	2024-12-19 08:52:49.398491+07	1
31c11426-43dc-4069-9f03-6b9714b7f239	1390fc3fb252fcbb92420777ca62ac747d0b2cb7fa4a50cab83574b969fd34da	2024-12-19 08:52:49.382661+07	20241203212633_fix_cycle_ondelete_fix_state_issue	\N	\N	2024-12-19 08:52:49.369384+07	1
6bc4f886-eb91-4ffd-a8d7-a9cccd5b2d69	ad35b2e6f31926110656d3568ca30b2f0b7ed4411aa01503b9ec111a77ae9908	2024-12-19 08:52:49.396669+07	20241203213623_creator_cycle	\N	\N	2024-12-19 08:52:49.383973+07	1
e126dd20-32a7-4df7-a772-a82c01408e54	36d655bd55d74c42d5bd9cb4ef9371057f678e696661727d2974cfafcc47250c	2024-12-19 08:53:41.610136+07	20241219015341_change_user_cycle	\N	\N	2024-12-19 08:53:41.554837+07	1
313a9425-5a8d-42ff-9f6d-04681678cdde	2370af5185053c3f053cafbe649127b2219f20f2874100e78daf5238836d3440	2024-12-19 23:09:21.019641+07	20241219160920_	\N	\N	2024-12-19 23:09:20.913892+07	1
eab45380-7280-44de-8388-13a71c67bbde	26f6fb631077b730771606d693147ae2f8a393ef2675abff927fa5675857dc4a	2024-12-19 10:21:37.197109+07	20241219032137_	\N	\N	2024-12-19 10:21:37.150399+07	1
33e271b9-4a67-4c67-a89f-8d02737b546e	00ac35ae82f34f6db9a94cf4d7f9f19767c05261acdfa8582ee2dbbf004516dd	2024-12-19 23:13:30.622423+07	20241219161330_	\N	\N	2024-12-19 23:13:30.563575+07	1
23309182-057b-4aa2-a1a4-52cac4eac8c9	6c17604c53502876cdc34e0bb335203825f7b7824648ee9d36231b5cffce951e	2024-12-19 23:18:18.33461+07	20241219161818_	\N	\N	2024-12-19 23:18:18.323047+07	1
ab00f2f4-dae0-4f7a-9809-73af9ece9195	1c5d53fdbce8c6dbbe70c8a547f7d30faf33d930188e8469ebe169c86fc70127	2024-12-19 23:37:03.401595+07	20241219163703_	\N	\N	2024-12-19 23:37:03.354375+07	1
03e5a067-df38-45a3-8aab-936abf696d2e	d6c10b1d72e1a7342c29700d72da1cb1d4fb20a6a83192eb2b28fc988628691d	2024-12-20 00:48:21.960295+07	20241219174821_	\N	\N	2024-12-20 00:48:21.909916+07	1
03cdfa6b-5997-4a6d-86e7-bb46aa60cdca	cde738f3ccab9c69217425bca39a8b0a41e11ba67756bad0f65a9aee1d12cf23	2024-12-28 04:32:17.121259+07	20241227213217_ondetele_issue_assignee	\N	\N	2024-12-28 04:32:17.071468+07	1
\.


--
-- TOC entry 5009 (class 0 OID 68548)
-- Dependencies: 230
-- Data for Name: cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cycles (id, description, "startDate", "dueDate", "projectId", "createdAt", "updatedAt", title, "creatorId") FROM stdin;
4827208c-ca53-4317-8395-f878dd1449ef		\N	\N	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-31 00:39:21.88	2024-12-31 00:40:37.515	Test upcoming	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b
e929fdda-d9f6-4b44-a120-50cf9832a65b		2024-12-09 17:00:00	2024-12-19 17:00:00	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-19 02:14:25.601	2024-12-31 00:41:02.165	Sprint 1: (10 - 20) Dec	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b
aa354ac0-a599-4303-948e-f4e02b4b05ed		2024-12-20 17:00:00	2024-12-29 17:00:00	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-19 15:58:53.309	2024-12-31 00:41:09.085	Sprint 2: (21-30) Dec	76dfcf8f-2b8f-481f-92e6-1a54036a54e9
7031ead7-35a4-4e94-b090-cf6aaf9a2156		2025-01-09 17:00:00	2025-01-15 17:00:00	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-31 00:39:08.254	2024-12-31 00:41:28.231	Test cycle	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b
75fbac41-75cb-414c-8bd8-f6345a55d106		2024-12-30 17:00:00	2025-01-07 17:00:00	7adad3f5-0f4b-498e-9d0c-fad46235e706	2024-12-31 00:39:55.391	2024-12-31 00:41:47.95	Sprint 3: Hello	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b
\.


--
-- TOC entry 5003 (class 0 OID 68258)
-- Dependencies: 224
-- Data for Name: issue_assignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issue_assignees (id, "issueId", "createdAt", "updatedAt", "memberId", "workspaceId") FROM stdin;
c7b0c146-2268-4295-959e-f223f1a82e62	343b5b3e-4271-451b-a8d9-e850f698e3ab	2024-12-30 23:07:25.12	2024-12-30 23:07:25.12	76dfcf8f-2b8f-481f-92e6-1a54036a54e9	d71de0f9-e88f-4ce7-b189-889c71456029
81599404-acd5-4940-97a7-4c31ed90f7af	343b5b3e-4271-451b-a8d9-e850f698e3ab	2024-12-30 23:07:25.12	2024-12-30 23:07:25.12	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029
efc01cd6-ff8c-4dff-b588-024c76ca0d00	c2ca4621-38f6-4f70-a744-542576e6d9a9	2024-12-30 23:10:01.087	2024-12-30 23:10:01.087	00e72136-a4b3-4339-9482-c92d618c1f32	d71de0f9-e88f-4ce7-b189-889c71456029
ceeb1554-2b8a-4183-be1c-4f0b4a7bafa7	a79d29c3-0949-4e8d-bac3-39488807ae21	2024-12-30 23:10:21.783	2024-12-30 23:10:21.783	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029
a358af95-7482-4775-b01e-c3e44b12ff9c	2418493d-88cf-44f7-a798-cff054368983	2024-12-30 23:43:34.221	2024-12-30 23:43:34.221	76dfcf8f-2b8f-481f-92e6-1a54036a54e9	d71de0f9-e88f-4ce7-b189-889c71456029
b7d5b774-9aa7-4ab1-914d-9372174f87ad	7d2d2126-c494-475a-8e95-0d7f624caaa5	2024-12-30 23:43:38.662	2024-12-30 23:43:38.662	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029
5b04270c-e58f-491f-b4c9-2b647a4cd883	fabe346b-b786-4cbe-be93-4fb5af07290e	2024-12-31 00:22:22.062	2024-12-31 00:22:22.062	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029
dd8646a2-409f-4774-849a-cc6e505e900f	51bd6c98-90b5-494b-a47e-d77be417f156	2024-12-31 00:22:26.157	2024-12-31 00:22:26.157	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029
58164374-30fb-4616-845c-dc83aa75eff3	9bde09fb-b7a4-40cc-81e6-aaf7190dd220	2024-12-31 00:22:32.13	2024-12-31 00:22:32.13	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029
5f336047-32b3-48fb-9b7d-19200cea4e98	5e00c727-8aa9-4268-bd54-9c5b1dae15ed	2024-12-31 00:24:46.515	2024-12-31 00:24:46.515	76dfcf8f-2b8f-481f-92e6-1a54036a54e9	d71de0f9-e88f-4ce7-b189-889c71456029
\.


--
-- TOC entry 5002 (class 0 OID 68250)
-- Dependencies: 223
-- Data for Name: issue_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issue_comments (id, content, "issueId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5001 (class 0 OID 68242)
-- Dependencies: 222
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issues (id, title, description, "stateId", "projectId", "creatorId", "createdAt", "updatedAt", "dueDate", priority, "sequenceNumber", "cycleId", "startDate") FROM stdin;
2418493d-88cf-44f7-a798-cff054368983	Print ad design		938d0387-5ebd-4592-824d-f614e71400a3	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-30 23:00:30.461	2024-12-30 23:43:19.816	2025-01-03 17:00:00	2	12	\N	2025-01-01 17:00:00
7d2d2126-c494-475a-8e95-0d7f624caaa5	Implement whole-home sync		938d0387-5ebd-4592-824d-f614e71400a3	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-30 23:00:44.555	2024-12-30 23:43:29.253	2025-01-09 17:00:00	2	13	\N	2024-12-24 17:00:00
640dee68-ad6e-4aa1-a429-c6c2fe0875a2	Hello		6b36bdce-3413-42e1-bd5f-6a8c1b0c1fde	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:16:17.31	2024-12-31 00:16:17.31	\N	0	29	\N	\N
c2ca4621-38f6-4f70-a744-542576e6d9a9	Design client's logo		938d0387-5ebd-4592-824d-f614e71400a3	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-30 23:00:11.642	2024-12-30 23:53:20.503	2024-12-02 17:00:00	3	10	aa354ac0-a599-4303-948e-f4e02b4b05ed	2024-12-02 17:00:00
9bde09fb-b7a4-40cc-81e6-aaf7190dd220	WEbsite redesign proposal		f340ed6c-ad36-4449-82f9-9fdd7f0b8213	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:12:41.179	2024-12-31 00:12:41.179	\N	0	22	\N	\N
aeceea6b-73cf-470a-928f-f479f4f09e9f	Analytics setup and training		f340ed6c-ad36-4449-82f9-9fdd7f0b8213	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:13:04.759	2024-12-31 00:13:04.759	\N	0	23	\N	\N
9239d4c0-ab23-4c5a-aa98-7b0255f4d9cc	Test cancelled		6b36bdce-3413-42e1-bd5f-6a8c1b0c1fde	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:15:57.553	2024-12-31 00:15:57.553	\N	0	28	\N	\N
2d388333-d66b-4292-ab9f-d9c0efe62e70	4 label		6b36bdce-3413-42e1-bd5f-6a8c1b0c1fde	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:16:36.635	2024-12-31 00:16:36.635	\N	0	30	\N	\N
494133cd-3cf4-44ec-8fa6-cf5cdd502199	Content marketing strategy		2317c37e-fd10-486d-a5b8-300e73d35d75	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:13:35.603	2024-12-31 00:25:55.789	\N	0	26	e929fdda-d9f6-4b44-a120-50cf9832a65b	2024-12-18 17:00:00
d410f3e0-5ea0-48c7-bc30-debccab66faf	Client onboarding documentation		2317c37e-fd10-486d-a5b8-300e73d35d75	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:13:45.277	2024-12-31 00:26:38.819	2024-12-25 17:00:00	0	27	\N	\N
b647acb6-81dd-4189-bf74-3d89f64464fb	Website UX/UI audit		f340ed6c-ad36-4449-82f9-9fdd7f0b8213	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:12:10.7	2024-12-31 00:26:42.91	2024-12-09 17:00:00	4	20	\N	2024-12-07 17:00:00
343b5b3e-4271-451b-a8d9-e850f698e3ab	Client communication protocol setup		938d0387-5ebd-4592-824d-f614e71400a3	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-30 23:00:02.843	2024-12-31 00:27:19.043	\N	2	9	\N	\N
a79d29c3-0949-4e8d-bac3-39488807ae21	Email marketing campaign setup		938d0387-5ebd-4592-824d-f614e71400a3	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-30 23:00:23.661	2024-12-31 00:27:23.31	\N	3	11	e929fdda-d9f6-4b44-a120-50cf9832a65b	2024-12-18 17:00:00
fabe346b-b786-4cbe-be93-4fb5af07290e	Client satìaction survey		ddf29724-e8d3-4236-ac2c-7c0d86d120a4	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:10:59.469	2024-12-31 00:29:06.547	\N	1	14	\N	2024-12-25 17:00:00
51bd6c98-90b5-494b-a47e-d77be417f156	Create initial client brief		f340ed6c-ad36-4449-82f9-9fdd7f0b8213	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:11:59.363	2024-12-31 00:29:09.796	\N	0	19	e929fdda-d9f6-4b44-a120-50cf9832a65b	2024-12-08 17:00:00
00a558b1-4909-45eb-a11b-0639a2ba8c66	Branding strategy development		ddf29724-e8d3-4236-ac2c-7c0d86d120a4	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:11:46.325	2024-12-31 00:29:26.949	2024-12-18 17:00:00	0	18	\N	\N
af6afd52-8587-4220-a760-ba6cb5e9406f	SEO strategy formulation		f340ed6c-ad36-4449-82f9-9fdd7f0b8213	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:12:25.847	2024-12-31 00:29:30.49	2024-12-10 17:00:00	1	21	\N	\N
e5f5158b-925b-41ac-bbcb-3073bb8b11fa	Competitive market analysis		2317c37e-fd10-486d-a5b8-300e73d35d75	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:13:22.084	2024-12-31 00:29:34.53	2024-12-08 17:00:00	0	25	aa354ac0-a599-4303-948e-f4e02b4b05ed	\N
f59318ce-2d65-484d-9268-d48fcf921a92	PPC campaign planning		ddf29724-e8d3-4236-ac2c-7c0d86d120a4	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:11:11.719	2024-12-31 00:42:13.288	\N	0	15	75fbac41-75cb-414c-8bd8-f6345a55d106	2024-12-13 17:00:00
349d1906-064a-4f16-b730-2604fcdb97b4	Social media content calendar		ddf29724-e8d3-4236-ac2c-7c0d86d120a4	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:11:23.002	2024-12-31 00:42:19.163	\N	4	16	75fbac41-75cb-414c-8bd8-f6345a55d106	\N
5e00c727-8aa9-4268-bd54-9c5b1dae15ed	Develop soicial media		2317c37e-fd10-486d-a5b8-300e73d35d75	7adad3f5-0f4b-498e-9d0c-fad46235e706	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	2024-12-31 00:13:12.865	2024-12-31 00:42:31.358	\N	0	24	75fbac41-75cb-414c-8bd8-f6345a55d106	\N
\.


--
-- TOC entry 5000 (class 0 OID 68225)
-- Dependencies: 221
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, "workspaceId", "createdAt", "updatedAt", "lastIssueNumber", token) FROM stdin;
1f94832a-7db9-47e9-b3f6-01129d801b06	test	test project	630b6ef9-0ec0-43ee-a1a1-a0934576bb51	2024-12-25 23:32:44.969	2024-12-25 23:32:44.969	0	J4CLK
871c16ad-afd2-453e-8028-ce151b88126b	project B		d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-27 11:46:21.488	2024-12-27 11:46:21.488	0	B6KEW
7adad3f5-0f4b-498e-9d0c-fad46235e706	Xidok	Dự án demo	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-19 02:13:31.801	2024-12-31 00:31:42.067	30	K1231
\.


--
-- TOC entry 4997 (class 0 OID 68196)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, "cognitoId", "firstName", "lastName", "avatarUrl", "isActive", "createdAt", "updatedAt", role, "lastWorkspaceSlug") FROM stdin;
76dfcf8f-2b8f-481f-92e6-1a54036a54e9	member@example.com	a438c498-e031-7031-04f1-eb188a893969	Test	Member	\N	t	2024-12-19 04:13:00.02	2024-12-25 19:27:54.447	USER	mem
c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	test@example.com	74b84408-0071-7001-ab66-49490025e4a2	Nguyen Van	A	/uploads/avtar-1735261491834-640f155c.jpg	t	2024-12-19 02:11:36.262	2024-12-27 23:39:02.45	USER	xidoke
00e72136-a4b3-4339-9482-c92d618c1f32	user@example.com	5408e498-8061-70c0-3943-d7a8c965604d	user	test	\N	t	2024-12-30 23:08:02.301	2024-12-30 23:09:04.311	USER	xidoke
b8f01ff6-1e02-463e-bdeb-b1c76e019b9d	phamdinhdo@example.com	145874e8-8001-7054-c30e-ff920e15b4f6	Pham Dinh	Do	\N	t	2024-12-31 00:19:49.102	2024-12-31 00:53:00.165	USER	invite-test
\.


--
-- TOC entry 4999 (class 0 OID 68216)
-- Dependencies: 220
-- Data for Name: workspace_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspace_members (id, "userId", "workspaceId", "updatedAt", "joinedAt", role) FROM stdin;
07ec5a10-ac5f-4931-aec0-8d0bc865662d	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-19 02:12:52.118	2024-12-19 02:12:52.118	OWNER
c028fec5-9387-4f4c-a60c-0ca34da6ddb3	76dfcf8f-2b8f-481f-92e6-1a54036a54e9	630b6ef9-0ec0-43ee-a1a1-a0934576bb51	2024-12-19 04:13:24.528	2024-12-19 04:13:24.528	OWNER
f9e47e56-0190-4bc9-824c-d49617e7909f	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	cca3dbb5-dca6-4afa-a283-299664c64a4d	2024-12-27 01:02:37.928	2024-12-27 01:02:37.928	OWNER
a5099a5f-8b28-4b1d-8d58-affc7d9955d2	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	b35a5ca9-36c1-470b-9bf9-a686045821d8	2024-12-27 12:10:47.61	2024-12-27 12:10:47.61	OWNER
55049b74-45ba-41b2-b4b4-6fb360068697	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	e70da1b9-357f-42f8-906a-f3d5377dd345	2024-12-27 22:10:46.005	2024-12-27 22:10:46.005	OWNER
6a026bcf-37cd-4407-9a9d-f289945ccc1f	76dfcf8f-2b8f-481f-92e6-1a54036a54e9	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-30 23:06:42.594	2024-12-30 23:06:42.594	MEMBER
a6a32b09-c8fa-4d8e-9f37-0020acc63138	00e72136-a4b3-4339-9482-c92d618c1f32	7e18270a-ab07-4172-b0c4-13d6bfd56c5a	2024-12-30 23:08:27.811	2024-12-30 23:08:27.811	OWNER
d9168a87-e99e-45aa-9818-b919799c1068	00e72136-a4b3-4339-9482-c92d618c1f32	d71de0f9-e88f-4ce7-b189-889c71456029	2024-12-30 23:08:58.444	2024-12-30 23:08:58.444	ADMIN
41eb55b9-413d-4e7c-9b9e-8d77201dc59c	b8f01ff6-1e02-463e-bdeb-b1c76e019b9d	1cd40189-1c02-449d-8c61-32bbac17433f	2024-12-31 00:20:01.11	2024-12-31 00:20:01.11	OWNER
d4fd53c5-9e88-45c4-afc1-c15c2d77de35	b8f01ff6-1e02-463e-bdeb-b1c76e019b9d	15e1744b-cbdf-4a25-9500-37b9bce1a5d7	2024-12-31 00:53:00.155	2024-12-31 00:53:00.155	OWNER
\.


--
-- TOC entry 4998 (class 0 OID 68208)
-- Dependencies: 219
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workspaces (id, slug, name, "createdAt", "updatedAt", "ownerId", "logoUrl") FROM stdin;
630b6ef9-0ec0-43ee-a1a1-a0934576bb51	mem	memberws	2024-12-19 04:13:24.528	2024-12-19 04:13:24.528	76dfcf8f-2b8f-481f-92e6-1a54036a54e9	\N
cca3dbb5-dca6-4afa-a283-299664c64a4d	workspace	Workspace	2024-12-27 01:02:37.928	2024-12-27 01:02:37.928	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	\N
d71de0f9-e88f-4ce7-b189-889c71456029	xidoke	xidoke	2024-12-19 02:12:52.118	2024-12-27 03:05:23.951	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	/uploads/logo-1735268723930-e9f633c0.avif
b35a5ca9-36c1-470b-9bf9-a686045821d8	test	test	2024-12-27 12:10:47.61	2024-12-27 12:10:47.61	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	\N
e70da1b9-357f-42f8-906a-f3d5377dd345	datn	Đồ án tốt nghiệp	2024-12-27 22:10:46.005	2024-12-27 23:28:30.223	c48cf9e5-505a-4cfe-8fa3-d5f7f560611b	/uploads/logo-1735342110218-e8f51518.avif
7e18270a-ab07-4172-b0c4-13d6bfd56c5a	yourws	test ws	2024-12-30 23:08:27.811	2024-12-30 23:08:27.811	00e72136-a4b3-4339-9482-c92d618c1f32	\N
1cd40189-1c02-449d-8c61-32bbac17433f	phamdinhdo	pdd	2024-12-31 00:20:01.11	2024-12-31 00:20:01.11	b8f01ff6-1e02-463e-bdeb-b1c76e019b9d	\N
15e1744b-cbdf-4a25-9500-37b9bce1a5d7	invite-test	Invite test	2024-12-31 00:53:00.155	2024-12-31 00:53:00.155	b8f01ff6-1e02-463e-bdeb-b1c76e019b9d	\N
\.


--
-- TOC entry 4808 (class 2606 OID 68389)
-- Name: FileAsset FileAsset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAsset"
    ADD CONSTRAINT "FileAsset_pkey" PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 68517)
-- Name: Label Label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Label"
    ADD CONSTRAINT "Label_pkey" PRIMARY KEY (id);


--
-- TOC entry 4817 (class 2606 OID 68443)
-- Name: State State_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "State_pkey" PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 68428)
-- Name: WorkspaceInvitation WorkspaceInvitation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceInvitation"
    ADD CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY (id);


--
-- TOC entry 4773 (class 2606 OID 68195)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 68555)
-- Name: cycles cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycles
    ADD CONSTRAINT cycles_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 68265)
-- Name: issue_assignees issue_assignees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_assignees
    ADD CONSTRAINT issue_assignees_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 68257)
-- Name: issue_comments issue_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_comments
    ADD CONSTRAINT issue_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 68249)
-- Name: issues issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 68232)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 68204)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 68224)
-- Name: workspace_members workspace_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 68215)
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 1259 OID 68391)
-- Name: FileAsset_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileAsset_createdById_idx" ON public."FileAsset" USING btree ("createdById");


--
-- TOC entry 4805 (class 1259 OID 68395)
-- Name: FileAsset_entityType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileAsset_entityType_idx" ON public."FileAsset" USING btree ("entityType");


--
-- TOC entry 4806 (class 1259 OID 68394)
-- Name: FileAsset_issueId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileAsset_issueId_idx" ON public."FileAsset" USING btree ("issueId");


--
-- TOC entry 4809 (class 1259 OID 68393)
-- Name: FileAsset_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileAsset_projectId_idx" ON public."FileAsset" USING btree ("projectId");


--
-- TOC entry 4810 (class 1259 OID 68392)
-- Name: FileAsset_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileAsset_userId_idx" ON public."FileAsset" USING btree ("userId");


--
-- TOC entry 4811 (class 1259 OID 68390)
-- Name: FileAsset_workspaceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FileAsset_workspaceId_idx" ON public."FileAsset" USING btree ("workspaceId");


--
-- TOC entry 4820 (class 1259 OID 68519)
-- Name: Label_name_projectId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Label_name_projectId_key" ON public."Label" USING btree (name, "projectId");


--
-- TOC entry 4823 (class 1259 OID 68518)
-- Name: Label_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Label_projectId_idx" ON public."Label" USING btree ("projectId");


--
-- TOC entry 4815 (class 1259 OID 68531)
-- Name: State_name_projectId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "State_name_projectId_key" ON public."State" USING btree (name, "projectId");


--
-- TOC entry 4818 (class 1259 OID 68530)
-- Name: State_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "State_projectId_idx" ON public."State" USING btree ("projectId");


--
-- TOC entry 4819 (class 1259 OID 68538)
-- Name: State_projectId_isDefault_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "State_projectId_isDefault_idx" ON public."State" USING btree ("projectId", "isDefault");


--
-- TOC entry 4812 (class 1259 OID 68429)
-- Name: WorkspaceInvitation_email_workspaceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkspaceInvitation_email_workspaceId_key" ON public."WorkspaceInvitation" USING btree (email, "workspaceId");


--
-- TOC entry 4802 (class 1259 OID 68288)
-- Name: _IssueToLabel_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_IssueToLabel_AB_unique" ON public."_IssueToLabel" USING btree ("A", "B");


--
-- TOC entry 4803 (class 1259 OID 68289)
-- Name: _IssueToLabel_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_IssueToLabel_B_index" ON public."_IssueToLabel" USING btree ("B");


--
-- TOC entry 4826 (class 1259 OID 68556)
-- Name: cycles_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cycles_projectId_idx" ON public.cycles USING btree ("projectId");


--
-- TOC entry 4789 (class 1259 OID 68543)
-- Name: issues_creatorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "issues_creatorId_idx" ON public.issues USING btree ("creatorId");


--
-- TOC entry 4790 (class 1259 OID 68557)
-- Name: issues_cycleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "issues_cycleId_idx" ON public.issues USING btree ("cycleId");


--
-- TOC entry 4791 (class 1259 OID 68545)
-- Name: issues_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "issues_dueDate_idx" ON public.issues USING btree ("dueDate");


--
-- TOC entry 4794 (class 1259 OID 68544)
-- Name: issues_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX issues_priority_idx ON public.issues USING btree (priority);


--
-- TOC entry 4795 (class 1259 OID 68541)
-- Name: issues_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "issues_projectId_idx" ON public.issues USING btree ("projectId");


--
-- TOC entry 4796 (class 1259 OID 68546)
-- Name: issues_projectId_sequenceNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "issues_projectId_sequenceNumber_key" ON public.issues USING btree ("projectId", "sequenceNumber");


--
-- TOC entry 4797 (class 1259 OID 68542)
-- Name: issues_stateId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "issues_stateId_idx" ON public.issues USING btree ("stateId");


--
-- TOC entry 4788 (class 1259 OID 68547)
-- Name: projects_workspaceId_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "projects_workspaceId_token_key" ON public.projects USING btree ("workspaceId", token);


--
-- TOC entry 4774 (class 1259 OID 68206)
-- Name: users_cognitoId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_cognitoId_key" ON public.users USING btree ("cognitoId");


--
-- TOC entry 4775 (class 1259 OID 68205)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4783 (class 1259 OID 68466)
-- Name: workspace_members_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "workspace_members_userId_idx" ON public.workspace_members USING btree ("userId");


--
-- TOC entry 4784 (class 1259 OID 68467)
-- Name: workspace_members_userId_workspaceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "workspace_members_userId_workspaceId_key" ON public.workspace_members USING btree ("userId", "workspaceId");


--
-- TOC entry 4785 (class 1259 OID 68465)
-- Name: workspace_members_workspaceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "workspace_members_workspaceId_idx" ON public.workspace_members USING btree ("workspaceId");


--
-- TOC entry 4780 (class 1259 OID 68287)
-- Name: workspaces_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX workspaces_slug_key ON public.workspaces USING btree (slug);


--
-- TOC entry 4841 (class 2606 OID 68401)
-- Name: FileAsset FileAsset_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAsset"
    ADD CONSTRAINT "FileAsset_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4842 (class 2606 OID 68495)
-- Name: FileAsset FileAsset_issueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAsset"
    ADD CONSTRAINT "FileAsset_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES public.issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 68490)
-- Name: FileAsset FileAsset_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAsset"
    ADD CONSTRAINT "FileAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 68406)
-- Name: FileAsset FileAsset_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAsset"
    ADD CONSTRAINT "FileAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4845 (class 2606 OID 68396)
-- Name: FileAsset FileAsset_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FileAsset"
    ADD CONSTRAINT "FileAsset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4848 (class 2606 OID 68568)
-- Name: Label Label_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Label"
    ADD CONSTRAINT "Label_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4847 (class 2606 OID 68573)
-- Name: State State_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "State_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4846 (class 2606 OID 68430)
-- Name: WorkspaceInvitation WorkspaceInvitation_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkspaceInvitation"
    ADD CONSTRAINT "WorkspaceInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4839 (class 2606 OID 68360)
-- Name: _IssueToLabel _IssueToLabel_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_IssueToLabel"
    ADD CONSTRAINT "_IssueToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES public.issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 68525)
-- Name: _IssueToLabel _IssueToLabel_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_IssueToLabel"
    ADD CONSTRAINT "_IssueToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES public."Label"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 86686)
-- Name: cycles cycles_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycles
    ADD CONSTRAINT "cycles_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4850 (class 2606 OID 68558)
-- Name: cycles cycles_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycles
    ADD CONSTRAINT "cycles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 88443)
-- Name: issue_assignees issue_assignees_issueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_assignees
    ADD CONSTRAINT "issue_assignees_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES public.issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 78500)
-- Name: issue_assignees issue_assignees_memberId_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_assignees
    ADD CONSTRAINT "issue_assignees_memberId_workspaceId_fkey" FOREIGN KEY ("memberId", "workspaceId") REFERENCES public.workspace_members("userId", "workspaceId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4835 (class 2606 OID 68588)
-- Name: issue_comments issue_comments_issueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_comments
    ADD CONSTRAINT "issue_comments_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES public.issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4836 (class 2606 OID 68593)
-- Name: issue_comments issue_comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issue_comments
    ADD CONSTRAINT "issue_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4831 (class 2606 OID 68325)
-- Name: issues issues_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT "issues_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4832 (class 2606 OID 68563)
-- Name: issues issues_cycleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT "issues_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES public.cycles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4833 (class 2606 OID 68500)
-- Name: issues issues_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT "issues_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4834 (class 2606 OID 68578)
-- Name: issues issues_stateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT "issues_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES public."State"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4830 (class 2606 OID 68300)
-- Name: projects projects_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4828 (class 2606 OID 68468)
-- Name: workspace_members workspace_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 68473)
-- Name: workspace_members workspace_members_workspaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 68370)
-- Name: workspaces workspaces_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT "workspaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-01-02 17:58:51

--
-- PostgreSQL database dump complete
--

