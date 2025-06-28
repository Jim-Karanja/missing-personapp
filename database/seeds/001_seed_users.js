/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Insert sample users
  await knex('users').insert([
    {
      id: 'admin-001',
      email: 'admin@mps.gov.ke',
      phone: '+254701234567',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      first_name: 'John',
      last_name: 'Kamau',
      id_number: 'ID12345678',
      role: 'admin',
      status: 'active',
      organization: 'Missing Persons Unit',
      badge_number: 'ADM001',
      profile_picture: null,
      permissions: JSON.stringify(['all']),
      email_verified: true,
      phone_verified: true,
      verification_token: null,
      last_login_at: new Date('2024-06-13'),
      reset_password_token: null,
      reset_password_expires: null,
      notification_preferences: JSON.stringify({
        email: true,
        sms: true,
        push: true,
        case_updates: true,
        system_alerts: true
      }),
      default_latitude: -1.2921,
      default_longitude: 36.8219,
      default_radius: 10000,
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-06-13')
    },
    {
      id: 'police-001',
      email: 'officer.mwangi@police.go.ke',
      phone: '+254702345678',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      first_name: 'Grace',
      last_name: 'Mwangi',
      id_number: 'ID23456789',
      role: 'police',
      status: 'active',
      organization: 'Kenya Police Service',
      badge_number: 'KPS2024001',
      profile_picture: null,
      permissions: JSON.stringify(['create_case', 'update_case', 'view_cases', 'manage_investigation']),
      email_verified: true,
      phone_verified: true,
      verification_token: null,
      last_login_at: new Date('2024-06-14'),
      reset_password_token: null,
      reset_password_expires: null,
      notification_preferences: JSON.stringify({
        email: true,
        sms: true,
        push: false,
        case_updates: true,
        system_alerts: true
      }),
      default_latitude: -1.0851,
      default_longitude: 37.0085,
      default_radius: 15000,
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-06-14')
    },
    {
      id: 'dci-001',
      email: 'detective.ochieng@dci.go.ke',
      phone: '+254703456789',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      first_name: 'Peter',
      last_name: 'Ochieng',
      id_number: 'ID34567890',
      role: 'dci',
      status: 'active',
      organization: 'Directorate of Criminal Investigations',
      badge_number: 'DCI2024005',
      profile_picture: null,
      permissions: JSON.stringify(['create_case', 'update_case', 'view_cases', 'manage_investigation', 'access_forensics']),
      email_verified: true,
      phone_verified: true,
      verification_token: null,
      last_login_at: new Date('2024-06-13'),
      reset_password_token: null,
      reset_password_expires: null,
      notification_preferences: JSON.stringify({
        email: true,
        sms: true,
        push: true,
        case_updates: true,
        system_alerts: true
      }),
      default_latitude: -1.2921,
      default_longitude: 36.8219,
      default_radius: 20000,
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-06-13')
    },
    {
      id: 'ngo-001',
      email: 'mary.wanjiku@redcross.or.ke',
      phone: '+254704567890',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      first_name: 'Mary',
      last_name: 'Wanjiku',
      id_number: 'ID45678901',
      role: 'ngo',
      status: 'active',
      organization: 'Kenya Red Cross Society',
      badge_number: 'KRCS001',
      profile_picture: null,
      permissions: JSON.stringify(['create_case', 'view_cases', 'provide_support']),
      email_verified: true,
      phone_verified: true,
      verification_token: null,
      last_login_at: new Date('2024-06-12'),
      reset_password_token: null,
      reset_password_expires: null,
      notification_preferences: JSON.stringify({
        email: true,
        sms: true,
        push: false,
        case_updates: true,
        system_alerts: false
      }),
      default_latitude: -1.2921,
      default_longitude: 36.8219,
      default_radius: 10000,
      created_at: new Date('2024-02-10'),
      updated_at: new Date('2024-06-12')
    },
    {
      id: 'citizen-001',
      email: 'james.mutua@citizen.ke',
      phone: '+254705678901',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      first_name: 'James',
      last_name: 'Mutua',
      id_number: 'ID56789012',
      role: 'citizen',
      status: 'active',
      organization: null,
      badge_number: null,
      profile_picture: null,
      permissions: JSON.stringify(['create_case', 'view_own_cases']),
      email_verified: true,
      phone_verified: false,
      verification_token: null,
      last_login_at: new Date('2024-06-10'),
      reset_password_token: null,
      reset_password_expires: null,
      notification_preferences: JSON.stringify({
        email: true,
        sms: false,
        push: false,
        case_updates: true,
        system_alerts: false
      }),
      default_latitude: -0.0236,
      default_longitude: 37.9062,
      default_radius: 5000,
      created_at: new Date('2024-05-15'),
      updated_at: new Date('2024-06-10')
    }
  ]);
};

