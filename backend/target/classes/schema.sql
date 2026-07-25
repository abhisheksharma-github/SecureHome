-- SecureHome Database Schema
-- Run this ONCE manually against your securehome_db database

DROP TABLE IF EXISTS alarms   CASCADE;
DROP TABLE IF EXISTS cameras  CASCADE;
DROP TABLE IF EXISTS users    CASCADE;
DROP TABLE IF EXISTS houses   CASCADE;

CREATE TABLE houses (
    id            BIGSERIAL    PRIMARY KEY,
    house_number  VARCHAR(20)  NOT NULL UNIQUE,
    block         VARCHAR(10)  NOT NULL,
    floor         INTEGER      NOT NULL DEFAULT 0,
    description   TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id             BIGSERIAL    PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    phone          VARCHAR(20),
    role           VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','MEMBER')),
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    house_id       BIGINT       REFERENCES houses(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);
CREATE INDEX idx_users_house ON users(house_id);

CREATE TABLE alarms (
    id               BIGSERIAL   PRIMARY KEY,
    triggered_by     BIGINT      NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    house_id         BIGINT      NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    status           VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ACKNOWLEDGED','RESOLVED')),
    message          TEXT,
    triggered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at  TIMESTAMPTZ,
    acknowledged_by  BIGINT      REFERENCES users(id) ON DELETE SET NULL,
    resolved_at      TIMESTAMPTZ
);
CREATE INDEX idx_alarms_status       ON alarms(status);
CREATE INDEX idx_alarms_triggered_by ON alarms(triggered_by);
CREATE INDEX idx_alarms_triggered_at ON alarms(triggered_at DESC);

CREATE TABLE cameras (
    id            BIGSERIAL    PRIMARY KEY,
    camera_name   VARCHAR(100) NOT NULL,
    location      VARCHAR(200) NOT NULL,
    stream_url    VARCHAR(500),
    status        VARCHAR(20)  NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE','OFFLINE','MAINTENANCE')),
    house_id      BIGINT       REFERENCES houses(id) ON DELETE SET NULL,
    installed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    last_ping     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cameras_status ON cameras(status);

INSERT INTO houses (house_number,block,floor,description) VALUES
  ('A-101','A',1,'Ground floor, Block A'),('A-201','A',2,'First floor, Block A'),
  ('A-301','A',3,'Second floor, Block A'),('B-101','B',1,'Ground floor, Block B'),
  ('B-201','B',2,'First floor, Block B');

-- Default admin password = Admin@123
INSERT INTO users (full_name,email,password_hash,phone,role,house_id) VALUES
  ('Society Admin','admin@securehome.com','$2a$12$CdadMjSZnugSUuf040iSpubIfuH8lMSAZPYT0tcVwSWp6welCtOzS','+91-9999999999','ADMIN',NULL);

INSERT INTO cameras (camera_name,location,stream_url,status) VALUES
  ('CAM-001','Main Entrance Gate',   'rtsp://sim/cam001','ONLINE'),
  ('CAM-002','Parking Lot A',        'rtsp://sim/cam002','ONLINE'),
  ('CAM-003','Parking Lot B',        'rtsp://sim/cam003','OFFLINE'),
  ('CAM-004','Swimming Pool Area',   'rtsp://sim/cam004','ONLINE'),
  ('CAM-005','Block A Corridor L1',  'rtsp://sim/cam005','ONLINE'),
  ('CAM-006','Block B Corridor L1',  'rtsp://sim/cam006','MAINTENANCE'),
  ('CAM-007','Gym Entrance',         'rtsp://sim/cam007','ONLINE'),
  ('CAM-008','Rooftop Access Door',  'rtsp://sim/cam008','OFFLINE');
