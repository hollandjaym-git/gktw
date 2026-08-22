--
-- PostgreSQL database dump
--

\restrict pPUwnfrYHSIRiiylOxRnlKsqdqx0iguUZ263UezenoTZLZnWsFz9fDQ7lMA17t7

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

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

-- Make this load idempotent and safe to run AFTER the backend's auto-seed:
-- clear the tables (and reset the id sequences) so the explicit ids below don't
-- collide with rows seedIfEmpty already inserted. Loads the exact prod-replica
-- state, including the 7 van overrides + 1 time override + tuned settings.
TRUNCATE public.gktw_shifts, public.gktw_van_settings, public.gktw_van_overrides, public.gktw_van_time_overrides RESTART IDENTITY;

--
-- Data for Name: gktw_shifts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.gktw_shifts VALUES (1, 'Malvin Sanders', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (2, 'Abby Hammett', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (3, 'William Baucum', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (4, 'Allie Shebs', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (5, 'Lisa Connell', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (6, 'Paxton Lambert', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (7, 'Baker Williams', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (8, 'Kailyn Steed', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (9, 'John William Connell', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (10, 'Hayden Gurganus', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (11, 'Alikah Henson', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (12, 'Cooper Southern', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (13, 'Rachel Steed', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (14, 'Isaac Steed', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (15, 'Peyton Judd', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (16, 'Tracey Mullinax', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (17, 'Bentley Watts', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (18, 'Claire Connell', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (19, 'Sophie Holland', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (20, 'Michelle Judd', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (21, 'Stacey Holland', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (22, 'Cole Reese', '2026-06-27', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (23, 'Michelle Whitaker', '2026-06-27', '7:30 AM', '11:00 AM', 450, 660, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (24, 'Nathan Whitaker', '2026-06-27', '7:30 AM', '11:00 AM', 450, 660, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (25, 'Jay Holland', '2026-06-27', '7:45 AM', '11:15 AM', 465, 675, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (26, 'Kara Kwasneiwski', '2026-06-27', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (27, 'Chloe Kwasneiwski', '2026-06-27', '8:30 AM', '12:00 PM', 510, 720, 'Carousel Gate Keeper', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (28, 'Keri Southern', '2026-06-27', '8:30 AM', '12:00 PM', 510, 720, 'Carousel Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (29, 'Keri Southern', '2026-06-27', '4:30 PM', '9:15 PM', 990, 1275, 'Olivia''s Oasis', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (30, 'Tracey Mullinax', '2026-06-27', '4:30 PM', '9:15 PM', 990, 1275, 'Olivia''s Oasis', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (31, 'Kailyn Steed', '2026-06-27', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (32, 'Hayden Gurganus', '2026-06-27', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (33, 'Allie Shebs', '2026-06-27', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (34, 'William Baucum', '2026-06-27', '5:30 PM', '9:15 PM', 1050, 1275, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (35, 'Peyton Judd', '2026-06-27', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (36, 'Alikah Henson', '2026-06-27', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (37, 'Chloe Kwasneiwski', '2026-06-27', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (38, 'Kara Kwasneiwski', '2026-06-27', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (39, 'Stacey Holland', '2026-06-27', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (40, 'Jay Holland', '2026-06-27', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (41, 'Nathan Whitaker', '2026-06-27', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (42, 'Michelle Whitaker', '2026-06-27', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (43, 'Claire Connell', '2026-06-27', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (44, 'Isaac Steed', '2026-06-27', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (45, 'Lisa Connell', '2026-06-27', '5:45 PM', '9:15 PM', 1065, 1275, 'Attractions Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (46, 'Michelle Judd', '2026-06-27', '5:45 PM', '9:15 PM', 1065, 1275, 'Attractions Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (47, 'Paxton Lambert', '2026-06-27', '6:00 PM', '9:15 PM', 1080, 1275, 'Carousel Gate Keeper', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (48, 'Rachel Steed', '2026-06-27', '6:00 PM', '9:15 PM', 1080, 1275, 'Carousel Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (49, 'Sophie Holland', '2026-06-27', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (50, 'Bentley Watts', '2026-06-27', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (51, 'Abby Hammett', '2026-06-27', '6:00 PM', '9:15 PM', 1080, 1275, 'Park of Dreams Attendant', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (52, 'Cooper Southern', '2026-06-27', '6:15 PM', '9:15 PM', 1095, 1275, 'WonderLab Greeter', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (53, 'John William Connell', '2026-06-27', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (54, 'Malvin Sanders', '2026-06-27', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (55, 'Baker Williams', '2026-06-27', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (56, 'Cole Reese', '2026-06-27', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (57, 'Michelle Judd', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Breakfast at Zach''s Timeout', '12+ w/ an adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (58, 'Tracey Mullinax', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (59, 'John William Connell', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (60, 'Lisa Connell', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (61, 'Paxton Lambert', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (62, 'William Baucum', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (63, 'Malvin Sanders', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (64, 'Abby Hammett', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (65, 'Cole Reese', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (66, 'Keri Southern', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (67, 'Cooper Southern', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (68, 'Rachel Steed', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (69, 'Isaac Steed', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (70, 'Baker Williams', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (71, 'Peyton Judd', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (72, 'Jay Holland', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (73, 'Michelle Whitaker', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (74, 'Nathan Whitaker', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (75, 'Kara Kwasneiwski', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (76, 'Sophie Holland', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (77, 'Stacey Holland', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (78, 'Claire Connell', '2026-06-28', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (79, 'Alikah Henson', '2026-06-28', '7:30 AM', '11:15 AM', 450, 675, 'Horse & Pony Rides', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (80, 'Bentley Watts', '2026-06-28', '7:30 AM', '11:15 AM', 450, 675, 'Horse & Pony Rides', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (81, 'Chloe Kwasneiwski', '2026-06-28', '7:30 AM', '11:15 AM', 450, 675, 'Horse & Pony Rides', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (82, 'Hayden Gurganus', '2026-06-28', '7:30 AM', '11:15 AM', 450, 675, 'Horse & Pony Rides', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (83, 'Allie Shebs', '2026-06-28', '7:30 AM', '11:15 AM', 450, 675, 'Horse & Pony Rides', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (84, 'Kailyn Steed', '2026-06-28', '7:30 AM', '11:15 AM', 450, 675, 'Horse & Pony Rides', '14+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (85, 'Alikah Henson', '2026-06-28', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (86, 'Peyton Judd', '2026-06-28', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (87, 'Sophie Holland', '2026-06-28', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (88, 'Cole Reese', '2026-06-28', '5:30 PM', '9:15 PM', 1050, 1275, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (89, 'Rachel Steed', '2026-06-28', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (90, 'Lisa Connell', '2026-06-28', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (91, 'Cooper Southern', '2026-06-28', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (92, 'Baker Williams', '2026-06-28', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (93, 'John William Connell', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (94, 'Abby Hammett', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (95, 'Kailyn Steed', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (96, 'Tracey Mullinax', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (97, 'Keri Southern', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (98, 'Malvin Sanders', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (99, 'Allie Shebs', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (100, 'Chloe Kwasneiwski', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (101, 'Kara Kwasneiwski', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (102, 'Claire Connell', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (103, 'Bentley Watts', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (104, 'Jay Holland', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (105, 'Paxton Lambert', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (106, 'Michelle Whitaker', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (107, 'Nathan Whitaker', '2026-06-28', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (108, 'Isaac Steed', '2026-06-28', '6:00 PM', '9:15 PM', 1080, 1275, 'Carousel Gate Keeper', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (109, 'William Baucum', '2026-06-28', '6:00 PM', '9:15 PM', 1080, 1275, 'Carousel Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (110, 'Michelle Judd', '2026-06-28', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (111, 'Stacey Holland', '2026-06-28', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (112, 'Hayden Gurganus', '2026-06-28', '6:00 PM', '9:15 PM', 1080, 1275, 'Park of Dreams Attendant', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (113, 'Cole Reese', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Breakfast at Zach''s Timeout', '12+ w/ an adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (114, 'Cooper Southern', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Breakfast at Zach''s Timeout', '12+ w/ an adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (115, 'Keri Southern', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (116, 'Rachel Steed', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (117, 'Isaac Steed', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (118, 'Kailyn Steed', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (119, 'Hayden Gurganus', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (120, 'Allie Shebs', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (121, 'Lisa Connell', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (122, 'Baker Williams', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (123, 'Malvin Sanders', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (124, 'Abby Hammett', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (125, 'Nathan Whitaker', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (126, 'Michelle Whitaker', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (127, 'Tracey Mullinax', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (128, 'Peyton Judd', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (129, 'Michelle Judd', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (130, 'Bentley Watts', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (131, 'Claire Connell', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (132, 'Kara Kwasneiwski', '2026-06-29', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (133, 'Alikah Henson', '2026-06-29', '7:30 AM', '11:00 AM', 450, 660, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (134, 'Stacey Holland', '2026-06-29', '7:30 AM', '11:00 AM', 450, 660, 'Train Conductor', '18+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (135, 'Jay Holland', '2026-06-29', '7:30 AM', '11:00 AM', 450, 660, 'Train Driver', '25+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (136, 'William Baucum', '2026-06-29', '7:45 AM', '11:15 AM', 465, 675, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (137, 'John William Connell', '2026-06-29', '7:45 AM', '11:15 AM', 465, 675, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (138, 'Chloe Kwasneiwski', '2026-06-29', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (139, 'Sophie Holland', '2026-06-29', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (140, 'Paxton Lambert', '2026-06-29', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (141, 'Keri Southern', '2026-06-29', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (142, 'Stacey Holland', '2026-06-29', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (143, 'Michelle Judd', '2026-06-29', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (144, 'Kara Kwasneiwski', '2026-06-29', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (145, 'Allie Shebs', '2026-06-29', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (146, 'Isaac Steed', '2026-06-29', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (147, 'Tracey Mullinax', '2026-06-29', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (148, 'Alikah Henson', '2026-06-29', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (149, 'Cole Reese', '2026-06-29', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (150, 'Cooper Southern', '2026-06-29', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (151, 'Abby Hammett', '2026-06-29', '5:45 PM', '9:15 PM', 1065, 1275, 'Attractions Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (152, 'Malvin Sanders', '2026-06-29', '5:45 PM', '9:15 PM', 1065, 1275, 'Attractions Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (153, 'Bentley Watts', '2026-06-29', '6:00 PM', '9:15 PM', 1080, 1275, 'Carousel Gate Keeper', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (154, 'Lisa Connell', '2026-06-29', '6:00 PM', '9:15 PM', 1080, 1275, 'Carousel Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (155, 'Rachel Steed', '2026-06-29', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (156, 'John William Connell', '2026-06-29', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (157, 'Jay Holland', '2026-06-29', '6:00 PM', '9:00 PM', 1080, 1260, 'Village Shuttle Driver', '18+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (158, 'Kailyn Steed', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (159, 'Baker Williams', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (160, 'Hayden Gurganus', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (161, 'Peyton Judd', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (162, 'Chloe Kwasneiwski', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (163, 'Claire Connell', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (164, 'Sophie Holland', '2026-06-29', '6:30 PM', '9:00 PM', 1110, 1260, 'Halloween Extravaganza', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (165, 'William Baucum', '2026-06-29', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (166, 'Paxton Lambert', '2026-06-29', '6:45 PM', '8:45 PM', 1125, 1245, 'Digital Photography Assistant', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (167, 'Nathan Whitaker', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Breakfast at Zach''s Timeout', '12+ w/ an adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (168, 'Michelle Whitaker', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Breakfast at Zach''s Timeout', '12+ w/ an adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (169, 'Jay Holland', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (170, 'Chloe Kwasneiwski', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (171, 'Abby Hammett', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (172, 'Alikah Henson', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (173, 'Lisa Connell', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (174, 'Allie Shebs', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (175, 'John William Connell', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (176, 'Cole Reese', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (177, 'Rachel Steed', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (178, 'Paxton Lambert', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (179, 'Kailyn Steed', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (180, 'Bentley Watts', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (181, 'Stacey Holland', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (182, 'Sophie Holland', '2026-07-01', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (183, 'William Baucum', '2026-07-01', '7:30 AM', '11:00 AM', 450, 660, 'Train Conductor', '18+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (184, 'Malvin Sanders', '2026-07-01', '7:30 AM', '11:00 AM', 450, 660, 'Train Driver', '25+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (185, 'Isaac Steed', '2026-07-01', '7:45 AM', '11:15 AM', 465, 675, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (186, 'Claire Connell', '2026-07-01', '7:45 AM', '11:15 AM', 465, 675, 'Amberville Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (187, 'Baker Williams', '2026-07-01', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (188, 'Hayden Gurganus', '2026-07-01', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (189, 'Peyton Judd', '2026-07-01', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (190, 'Kara Kwasneiwski', '2026-07-01', '8:30 AM', '12:00 PM', 510, 720, 'Carousel Gate Keeper', '16+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (191, 'Tracey Mullinax', '2026-07-01', '8:30 AM', '12:00 PM', 510, 720, 'Carousel Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (192, 'Baker Williams', '2026-07-01', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (193, 'Lisa Connell', '2026-07-01', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (194, 'Rachel Steed', '2026-07-01', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (195, 'Isaac Steed', '2026-07-01', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (196, 'Chloe Kwasneiwski', '2026-07-01', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (197, 'Michelle Whitaker', '2026-07-01', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (198, 'Nathan Whitaker', '2026-07-01', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (199, 'Kara Kwasneiwski', '2026-07-01', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (200, 'Paxton Lambert', '2026-07-01', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (201, 'Hayden Gurganus', '2026-07-01', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (202, 'Tracey Mullinax', '2026-07-01', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Greeter', '16+', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (203, 'Kailyn Steed', '2026-07-01', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (204, 'Allie Shebs', '2026-07-01', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (205, 'Abby Hammett', '2026-07-01', '5:45 PM', '9:15 PM', 1065, 1275, 'Attractions Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (206, 'Stacey Holland', '2026-07-01', '5:45 PM', '9:15 PM', 1065, 1275, 'Attractions Operator', '18+', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (207, 'Claire Connell', '2026-07-01', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (208, 'Peyton Judd', '2026-07-01', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (209, 'Malvin Sanders', '2026-07-01', '6:00 PM', '9:00 PM', 1080, 1260, 'Village Shuttle Driver', '18+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (210, 'Sophie Holland', '2026-07-01', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (211, 'Jay Holland', '2026-07-01', '6:30 PM', '10:00 PM', 1110, 1320, 'Henri''s Starlite Scoops', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (212, 'John William Connell', '2026-07-01', '6:30 PM', '8:45 PM', 1110, 1245, 'Mayor Clayton''s Surprise Birthday Bash', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (213, 'Bentley Watts', '2026-07-01', '6:30 PM', '8:45 PM', 1110, 1245, 'Mayor Clayton''s Surprise Birthday Bash', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (214, 'Alikah Henson', '2026-07-01', '6:30 PM', '8:45 PM', 1110, 1245, 'Mayor Clayton''s Surprise Birthday Bash', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (215, 'William Baucum', '2026-07-01', '6:30 PM', '8:45 PM', 1110, 1245, 'Mayor Clayton''s Surprise Birthday Bash', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (216, 'Cole Reese', '2026-07-01', '6:30 PM', '8:45 PM', 1110, 1245, 'Mayor Clayton''s Surprise Birthday Bash', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (217, 'Abby Hammett', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (218, 'Malvin Sanders', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (219, 'William Baucum', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (220, 'Lisa Connell', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (221, 'Allie Shebs', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (222, 'Hayden Gurganus', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (223, 'John William Connell', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (224, 'Cole Reese', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (225, 'Rachel Steed', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (226, 'Isaac Steed', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (227, 'Kailyn Steed', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (228, 'Paxton Lambert', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (229, 'Baker Williams', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (230, 'Chloe Kwasneiwski', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (231, 'Michelle Whitaker', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (232, 'Sophie Holland', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (233, 'Stacey Holland', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (234, 'Claire Connell', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (235, 'Peyton Judd', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (236, 'Jay Holland', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (237, 'Tracey Mullinax', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (238, 'Kara Kwasneiwski', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Breakfast', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (239, 'Nathan Whitaker', '2026-07-02', '7:30 AM', '10:30 AM', 450, 630, 'Cafe Clayton Greeter', '16+', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (240, 'Bentley Watts', '2026-07-02', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (241, 'Alikah Henson', '2026-07-02', '8:00 AM', '11:15 AM', 480, 675, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (242, 'Chloe Kwasneiwski', '2026-07-02', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (243, 'Sophie Holland', '2026-07-02', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (244, 'Peyton Judd', '2026-07-02', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (245, 'Bentley Watts', '2026-07-02', '4:30 PM', '9:15 PM', 990, 1275, 'Rockin'' Spa Transformation Attendant', '14+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (246, 'Stacey Holland', '2026-07-02', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (247, 'Jay Holland', '2026-07-02', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (248, 'Abby Hammett', '2026-07-02', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (249, 'Malvin Sanders', '2026-07-02', '5:30 PM', '9:30 PM', 1050, 1290, 'Cafe Clayton Delivery', '16+ w/ valid driver''s license', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (250, 'Nathan Whitaker', '2026-07-02', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (251, 'Michelle Whitaker', '2026-07-02', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (252, 'Rachel Steed', '2026-07-02', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (253, 'Alikah Henson', '2026-07-02', '5:30 PM', '8:30 PM', 1050, 1230, 'Cafe Clayton Dinner', '8+ w/ adult; 16+ alone', 'Meet F&B in the Cafe');
INSERT INTO public.gktw_shifts VALUES (254, 'Lisa Connell', '2026-07-02', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (255, 'John William Connell', '2026-07-02', '5:30 PM', '9:15 PM', 1050, 1275, 'Castle Attendant', '10+ w/ an adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (256, 'Kara Kwasneiwski', '2026-07-02', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (257, 'Tracey Mullinax', '2026-07-02', '6:00 PM', '9:00 PM', 1080, 1260, 'Noah''s Nook Attendant', '10+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (258, 'William Baucum', '2026-07-02', '6:00 PM', '9:00 PM', 1080, 1260, 'Village Shuttle Driver', '18+ w/ valid driver''s license', 'Go to Engineering');
INSERT INTO public.gktw_shifts VALUES (259, 'Allie Shebs', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (260, 'Hayden Gurganus', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (261, 'Paxton Lambert', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (262, 'Baker Williams', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (263, 'Isaac Steed', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (264, 'Cole Reese', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (265, 'Kailyn Steed', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');
INSERT INTO public.gktw_shifts VALUES (266, 'Claire Connell', '2026-07-02', '6:00 PM', '9:30 PM', 1080, 1290, 'Winter Wonderland', '8+ w/ adult; 16+ alone', 'Wait in VS lobby');


--
-- Data for Name: gktw_van_overrides; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.gktw_van_overrides VALUES (1, '2026-07-01', 'evening', 'out', 'Noah''s Nook Attendant', 1);
INSERT INTO public.gktw_van_overrides VALUES (2, '2026-07-01', 'evening', 'out', 'Village Shuttle Driver', 1);
INSERT INTO public.gktw_van_overrides VALUES (4, '2026-07-01', 'evening', 'back', 'Cafe Clayton Greeter', 1);
INSERT INTO public.gktw_van_overrides VALUES (3, '2026-07-01', 'evening', 'back', 'Henri''s Starlite Scoops', 3);
INSERT INTO public.gktw_van_overrides VALUES (10, '2026-07-01', 'evening', 'back', 'Attractions Operator', 1);
INSERT INTO public.gktw_van_overrides VALUES (9, '2026-07-01', 'evening', 'back', 'Castle Attendant', 1);
INSERT INTO public.gktw_van_overrides VALUES (5, '2026-07-01', 'evening', 'back', 'Cafe Clayton Delivery', 3);


--
-- Data for Name: gktw_van_settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.gktw_van_settings VALUES (1, 29, 15);


--
-- Data for Name: gktw_van_time_overrides; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.gktw_van_time_overrides VALUES (1, '2026-07-01', 'evening', 'back', 1290, 1320);


--
-- Name: gktw_shifts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gktw_shifts_id_seq', 266, true);


--
-- Name: gktw_van_overrides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gktw_van_overrides_id_seq', 15, true);


--
-- Name: gktw_van_time_overrides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gktw_van_time_overrides_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict pPUwnfrYHSIRiiylOxRnlKsqdqx0iguUZ263UezenoTZLZnWsFz9fDQ7lMA17t7

