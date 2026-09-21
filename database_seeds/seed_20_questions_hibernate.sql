-- ==============================================================================
-- TalentOrbit Production Database Migration: 20-Question Master Seed for HIBERNATE
-- Table: assessment_questions
-- Architecture: 100% Backend-Stored in MySQL, Served via Spring Boot REST API
-- Endpoint: GET /api/assessment/filter/framework/Hibernate
-- ==============================================================================

-- 1. Ensure Table Structure Exists
CREATE TABLE IF NOT EXISTS assessment_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    language VARCHAR(100) NULL,
    framework VARCHAR(100) NULL,
    tech_type VARCHAR(50) NOT NULL DEFAULT 'FRAMEWORK',
    topic VARCHAR(150) NOT NULL,
    text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(5) NOT NULL,
    explanation TEXT NULL,
    INDEX idx_lang (language),
    INDEX idx_framework (framework),
    INDEX idx_tech_type (tech_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Optional: Clean existing Hibernate questions to prevent duplicates
DELETE FROM assessment_questions WHERE framework = 'Hibernate' OR (framework IS NULL AND topic LIKE '%Hibernate%');

-- ==============================================================================
-- 3. HIBERNATE — 20 Production Scenario Questions
-- ==============================================================================
INSERT INTO assessment_questions (language, framework, tech_type, topic, text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
('Java', 'Hibernate', 'FRAMEWORK', 'Entity Lifecycle & States',
 'In Hibernate / JPA, an entity instance has been instantiated using "new User()" with its fields set, but session.persist(user) has not been invoked. In which lifecycle state does this entity reside?',
 'Detached state',
 'Transient state',
 'Persistent state',
 'Removed state',
 'B', 'A freshly instantiated Java object not associated with any Hibernate Session or database identifier is in the Transient state.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Entity Lifecycle & States',
 'What happens to a persistent Hibernate entity when session.clear() or session.close() is called?',
 'The entity is permanently deleted from the database table',
 'The entity transitions from Persistent state to Detached state',
 'The entity becomes Transient and loses its generated primary key ID',
 'The entity triggers an automatic rollback of the current database transaction',
 'B', 'When a Session is closed or cleared, all associated persistent objects transition to the Detached state.'),

('Java', 'Hibernate', 'FRAMEWORK', 'First-Level vs Second-Level Cache',
 'In Hibernate, what is the default scope and lifecycle of the First-Level Cache (Session Cache)?',
 'It is JVM-wide and shared across all active user sessions and threads',
 'It is strictly scoped to the individual Session instance and discarded when the session closes',
 'It is distributed across clustered nodes via Redis or Hazelcast',
 'It is stored permanently on the filesystem in the hibernate.temp directory',
 'B', 'The First-Level Cache is bound to the Hibernate Session boundary and is mandatory for transaction isolation and identity preservation.'),

('Java', 'Hibernate', 'FRAMEWORK', 'First-Level vs Second-Level Cache',
 'When configuring a Hibernate Second-Level Cache (L2) with a provider like Ehcache or Hazelcast, what annotation must be placed on the Entity class in addition to @Entity?',
 '@Cacheable or @org.hibernate.annotations.Cache',
 '@EnableCaching',
 '@SecondLevelCache',
 '@DistributedEntity',
 'A', '@Cacheable (JPA standard) or @Cache(usage = CacheConcurrencyStrategy.READ_WRITE) enables L2 caching for that entity.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Association Mappings & Cascade',
 'When defining a bidirectional @OneToMany relationship between Department and Employee, on which entity should the mappedBy attribute be configured?',
 'On the Employee entity (the child table holding the foreign key column)',
 'On the Department entity inside the @OneToMany annotation pointing to the department field in Employee',
 'On both entities simultaneously to ensure two-way synchronization',
 'In the application.properties file using hibernate.relationship.mappedBy',
 'B', 'The mappedBy attribute always resides on the non-owning side (Department @OneToMany) to tell Hibernate that Employee owns the foreign key.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Association Mappings & Cascade',
 'What is the key consequence of specifying CascadeType.REMOVE vs orphanRemoval = true on a @OneToMany relationship?',
 'CascadeType.REMOVE only deletes children when the parent itself is deleted; orphanRemoval = true also deletes child rows if removed from the parent collection',
 'orphanRemoval only applies to SQL databases; CascadeType.REMOVE works in NoSQL databases',
 'CascadeType.REMOVE prevents foreign key constraint violations during bulk update operations',
 'Both are identical aliases in Hibernate 6 and exhibit the exact same behavior',
 'A', 'orphanRemoval=true deletes child records automatically when they are dereferenced or removed from the parent collection list in Java.'),

('Java', 'Hibernate', 'FRAMEWORK', 'N+1 Select Problem & Fetch Strategies',
 'What is the classic "N+1 Select Problem" in Hibernate and when does it most frequently occur?',
 'Executing N insert statements followed by 1 bulk commit in a single transaction',
 'Fetching a list of N parent entities, and then issuing N additional SQL select queries to fetch each parent\'s lazy-loaded child collection',
 'Using N different database connection pools concurrently across threads',
 'Failing to define a primary key index on a table with more than N records',
 'B', 'When loading N parent rows with FetchType.LAZY (or default iterations), Hibernate executes 1 query for parents and N subsequent queries for children.'),

('Java', 'Hibernate', 'FRAMEWORK', 'N+1 Select Problem & Fetch Strategies',
 'Which JPQL / HQL query clause effectively eliminates the N+1 select problem by fetching the parent and child entities in a single SQL JOIN query?',
 'SELECT p FROM Parent p INNER JOIN p.children',
 'SELECT p FROM Parent p JOIN FETCH p.children',
 'SELECT p FROM Parent p BATCH FETCH p.children',
 'SELECT p FROM Parent p WITH LAZY = FALSE',
 'B', 'JOIN FETCH instructs Hibernate to initialize the associated collection immediately in the same SELECT statement using an SQL JOIN.'),

('Java', 'Hibernate', 'FRAMEWORK', 'HQL & JPQL Query Optimization',
 'What is the key difference between JPQL / HQL and native SQL queries executed via Hibernate?',
 'JPQL queries the entity class and its properties; native SQL queries the database tables and columns directly',
 'JPQL cannot return projection columns; native SQL only returns strings',
 'Native SQL queries are automatically cached in the L1 Session cache; JPQL queries are not',
 'JPQL queries require manual transaction rollback on syntax errors',
 'A', 'JPQL operates on the abstract domain model (Entity names and field names) rather than physical database table and column names.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Dirty Checking & Flush Mechanism',
 'How does Hibernate\'s automatic Dirty Checking mechanism detect that an entity\'s state has changed during a transaction?',
 'By constantly polling the database using background threads every 500ms',
 'By comparing the current property values of persistent objects against their initial loaded snapshot taken when entering the Session',
 'By requiring all entity setter methods to implement PropertyChangeListener',
 'By inspecting the git commit history of the compiled Java entity class',
 'B', 'When an entity enters the Session, Hibernate stores a loaded snapshot. During flush, it compares current values with the snapshot to generate UPDATE statements.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Optimistic vs Pessimistic Locking',
 'Which annotation is utilized in Hibernate / JPA to implement non-blocking Optimistic Locking with automatic concurrent modification detection?',
 '@Version on an integer, long, or timestamp field',
 '@Lock(LockModeType.PESSIMISTIC_WRITE)',
 '@ConcurrentSafe',
 '@Synchronized',
 'A', 'The @Version annotation tells Hibernate to check the version column in the WHERE clause: "WHERE id=? AND version=?". If rowcount is 0, an OptimisticLockException is thrown.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Optimistic vs Pessimistic Locking',
 'What runtime exception does Hibernate throw when two concurrent transactions attempt to update the exact same versioned entity row?',
 'org.hibernate.exception.ConstraintViolationException',
 'jakarta.persistence.OptimisticLockException (or org.hibernate.StaleObjectStateException)',
 'java.util.ConcurrentModificationException',
 'org.hibernate.QueryTimeoutException',
 'B', 'When the expected version does not match the database version during commit, an OptimisticLockException / StaleObjectStateException is thrown.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Inheritance Mapping Strategies',
 'Which InheritanceType strategy in JPA/Hibernate stores all classes of an inheritance hierarchy in a single relational table, differentiating rows via a discriminator column?',
 'InheritanceType.JOINED',
 'InheritanceType.SINGLE_TABLE',
 'InheritanceType.TABLE_PER_CLASS',
 'InheritanceType.MAPPED_SUPERCLASS',
 'B', 'InheritanceType.SINGLE_TABLE puts the entire class hierarchy into one table with a discriminator column (e.g. @DiscriminatorColumn).'),

('Java', 'Hibernate', 'FRAMEWORK', 'Inheritance Mapping Strategies',
 'What is the main database trade-off when using InheritanceType.JOINED compared to InheritanceType.SINGLE_TABLE?',
 'JOINED normalizes data without null columns, but requires SQL JOINs across subclass tables which can degrade query performance on deep hierarchies',
 'JOINED prevents the use of foreign keys in subclass tables',
 'SINGLE_TABLE is incompatible with Spring Data JPA repositories',
 'JOINED cannot be used with PostgreSQL or MySQL databases',
 'A', 'InheritanceType.JOINED provides clean 3NF relational normalization but requires multi-table JOIN queries whenever subclasses are retrieved.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Batch Processing & Memory Management',
 'When inserting 100,000 entities in a batch loop with Hibernate, what must be called periodically to avoid an OutOfMemoryError in the JVM?',
 'session.flush() followed immediately by session.clear()',
 'System.gc() inside every iteration',
 'session.close() followed by new Configuration().buildSessionFactory()',
 'session.refresh(entity) on each object',
 'A', 'session.flush() executes pending SQL statements, and session.clear() evicts all entities from the First-Level cache, releasing memory.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Primary Key Generation Strategies',
 'Which GenerationType strategy relies on an auto-increment or serial column provided natively by relational database engines such as MySQL or SQL Server?',
 'GenerationType.SEQUENCE',
 'GenerationType.IDENTITY',
 'GenerationType.TABLE',
 'GenerationType.AUTO',
 'B', 'GenerationType.IDENTITY delegates primary key ID generation directly to the database identity/auto-increment column.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Criteria API & Dynamic Filtering',
 'In JPA 2.x+ / Hibernate 6, which interface is used to build type-safe, criteria-based dynamic queries without writing raw string statements?',
 'jakarta.persistence.criteria.CriteriaBuilder',
 'org.hibernate.QueryBuilder',
 'org.hibernate.criterion.Restrictions',
 'jakarta.persistence.DynamicSqlBuilder',
 'A', 'CriteriaBuilder (combined with CriteriaQuery and Root) provides compile-time type safety for building complex dynamic queries.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Transaction Management & Session',
 'What is the difference between session.get() and session.load() (or entityManager.find() vs entityManager.getReference())?',
 'session.get() hits the database immediately and returns null if not found; session.load() returns a lazy proxy without querying until an attribute is accessed',
 'session.get() requires an active transaction; session.load() does not',
 'session.load() bypasses the First-Level cache completely',
 'session.get() is deprecated in Hibernate 6',
 'A', 'get() eagerly queries the DB and returns null if the row is absent; load() returns a bytecode proxy that throws EntityNotFoundException if accessed when non-existent.'),

('Java', 'Hibernate', 'FRAMEWORK', 'LazyInitializationException',
 'Why does org.hibernate.LazyInitializationException occur in a Spring Boot application?',
 'Attempting to access an uninitialized lazy collection or relationship after the Hibernate Session / EntityManager has already been closed',
 'Configuring Hibernate with an invalid JDBC driver connection string',
 'Running Hibernate on Java 21 without enabling preview features',
 'Calling session.persist() on an entity that contains null values in non-nullable columns',
 'A', 'When an entity is detached and its Session has closed, accessing an uninitialized lazy proxy throws LazyInitializationException: could not initialize proxy - no Session.'),

('Java', 'Hibernate', 'FRAMEWORK', 'Batch Fetching & Performance Tuning',
 'Which Hibernate annotation can be configured on a lazy collection or entity class to load child collections in batches (e.g. batch of 25) instead of one by one?',
 '@org.hibernate.annotations.BatchSize(size = 25)',
 '@FetchBatch(limit = 25)',
 '@BatchQuery(chunk = 25)',
 '@CollectionPool(size = 25)',
 'A', '@BatchSize(size = N) optimizes lazy loading by using an SQL IN clause to fetch up to N uninitialized proxies in a single round-trip query.');
