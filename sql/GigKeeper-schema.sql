--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE "SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE "SequelizeMeta" OWNER TO gigkeeper;

--
-- Name: contractors; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE contractors (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    contact character varying(255),
    address1 character varying(255),
    address2 character varying(255),
    city character varying(255),
    region character varying(255),
    "postalCode" character varying(255),
    phone character varying(255),
    email character varying(255),
    web character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "profileId" uuid NOT NULL
);


ALTER TABLE contractors OWNER TO gigkeeper;

--
-- Name: gig_tags; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE gig_tags (
    id uuid NOT NULL,
    "gigId" uuid NOT NULL,
    "tagId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "profileId" uuid NOT NULL
);


ALTER TABLE gig_tags OWNER TO gigkeeper;

--
-- Name: gigs; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE gigs (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    place jsonb,
    distance numeric(8,2),
    duration numeric(8,2),
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "profileId" uuid NOT NULL,
    "contractorId" uuid NOT NULL
);


ALTER TABLE gigs OWNER TO gigkeeper;

--
-- Name: invites; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE invites (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    message text,
    "userId" uuid NOT NULL,
    "registeredAt" timestamp with time zone,
    "profileId" uuid
);


ALTER TABLE invites OWNER TO gigkeeper;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE profiles (
    id uuid NOT NULL,
    "homeBasePlace" jsonb,
    "defaultDuration" integer,
    "leadTime" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE profiles OWNER TO gigkeeper;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE tags (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "profileId" uuid NOT NULL
);


ALTER TABLE tags OWNER TO gigkeeper;

--
-- Name: users; Type: TABLE; Schema: public; Owner: gigkeeper
--

CREATE TABLE users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "firstName" character varying(255),
    "lastName" character varying(255),
    phone character varying(255),
    active boolean DEFAULT false,
    scope character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "profileId" uuid NOT NULL
);


ALTER TABLE users OWNER TO gigkeeper;

--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY "SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: contractors contractors_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY contractors
    ADD CONSTRAINT contractors_pkey PRIMARY KEY (id);


--
-- Name: gig_tags gig_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gig_tags
    ADD CONSTRAINT gig_tags_pkey PRIMARY KEY (id);


--
-- Name: gigs gigs_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gigs
    ADD CONSTRAINT gigs_pkey PRIMARY KEY (id);


--
-- Name: invites invites_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY invites
    ADD CONSTRAINT invites_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: invites_email_code; Type: INDEX; Schema: public; Owner: gigkeeper
--

CREATE UNIQUE INDEX invites_email_code ON invites USING btree (email, code);


--
-- Name: contractors contractors_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY contractors
    ADD CONSTRAINT "contractors_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES profiles(id) ON UPDATE CASCADE;


--
-- Name: gig_tags gig_tags_gigId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gig_tags
    ADD CONSTRAINT "gig_tags_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES gigs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gig_tags gig_tags_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gig_tags
    ADD CONSTRAINT "gig_tags_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES profiles(id) ON UPDATE CASCADE;


--
-- Name: gig_tags gig_tags_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gig_tags
    ADD CONSTRAINT "gig_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: gigs gigs_contractorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gigs
    ADD CONSTRAINT "gigs_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES contractors(id) ON UPDATE CASCADE;


--
-- Name: gigs gigs_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY gigs
    ADD CONSTRAINT "gigs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES profiles(id) ON UPDATE CASCADE;


--
-- Name: invites invites_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY invites
    ADD CONSTRAINT "invites_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES profiles(id);


--
-- Name: invites invites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY invites
    ADD CONSTRAINT "invites_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id);


--
-- Name: tags tags_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT "tags_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES profiles(id) ON UPDATE CASCADE;


--
-- Name: users users_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gigkeeper
--

ALTER TABLE ONLY users
    ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES profiles(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

