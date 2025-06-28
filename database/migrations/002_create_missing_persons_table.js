/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('missing_persons', (table) => {
    table.string('id', 36).primary();
    table.string('case_number').notNullable().unique();
    
    // Reporter information
    table.string('reported_by', 36).references('id').inTable('users').onDelete('CASCADE');
    table.string('reporter_relationship').nullable(); // relationship to missing person
    
    // Missing person details
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('middle_name').nullable();
    table.string('nickname').nullable();
    table.date('date_of_birth').nullable();
    table.integer('age_at_disappearance').nullable();
    table.string('gender').nullable().checkIn(['male', 'female', 'other', 'unknown']);
    table.string('id_number').nullable(); // National ID if available
    table.string('passport_number').nullable();
    
    // Physical description
    table.integer('height_cm').nullable();
    table.integer('weight_kg').nullable();
    table.string('eye_color').nullable();
    table.string('hair_color').nullable();
    table.string('skin_tone').nullable();
    table.text('distinguishing_marks').nullable(); // scars, tattoos, etc.
    table.text('physical_description').nullable();
    table.text('clothing_description').nullable(); // what they were wearing (JSON as text)
    
    // Disappearance details
    table.timestamp('disappeared_at').notNullable();
    table.decimal('last_seen_latitude', 10, 8).nullable();
    table.decimal('last_seen_longitude', 11, 8).nullable();
    table.string('last_seen_location').nullable(); // text description
    table.text('circumstances').nullable(); // circumstances of disappearance
    table.text('last_known_contacts').nullable(); // people they were with (JSON as text)
    table.string('last_known_activity').nullable();
    
    // Case status
    table.string('status').defaultTo('active').checkIn([
      'active', 'found_alive', 'found_deceased', 'closed', 'suspended'
    ]);
    table.string('priority').defaultTo('medium').checkIn(['low', 'medium', 'high', 'critical']);
    table.boolean('is_child').defaultTo(false); // under 18
    table.boolean('is_vulnerable').defaultTo(false); // elderly, disabled, etc.
    table.boolean('foul_play_suspected').defaultTo(false);
    
    // Investigation details
    table.string('assigned_officer', 36).references('id').inTable('users').nullable();
    table.string('police_station').nullable();
    table.string('ob_number').nullable(); // Occurrence Book number
    table.text('investigation_notes').nullable();
    
    // Contact information
    table.string('contact_phone').nullable();
    table.string('contact_email').nullable();
    table.string('emergency_contact_name').nullable();
    table.string('emergency_contact_phone').nullable();
    
    // Media and documents
    table.text('photos').nullable(); // array of photo URLs (JSON as text)
    table.text('documents').nullable(); // array of document URLs (JSON as text)
    table.string('primary_photo').nullable(); // main photo URL
    
    // Visibility and privacy
    table.boolean('is_public').defaultTo(true); // visible to public
    table.boolean('media_consent').defaultTo(false); // consent for media sharing
    table.text('visibility_settings').nullable(); // who can see what (JSON as text)
    
    // Integration tracking
    table.text('external_case_numbers').nullable(); // other system references (JSON as text)
    table.timestamp('last_updated_by_user').nullable();
    table.string('last_updated_by', 36).references('id').inTable('users').nullable();
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['case_number']);
    table.index(['reported_by']);
    table.index(['status']);
    table.index(['priority']);
    table.index(['is_child']);
    table.index(['disappeared_at']);
    table.index(['last_seen_latitude', 'last_seen_longitude']);
    table.index(['assigned_officer']);
    table.index(['is_public']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('missing_persons');
};

