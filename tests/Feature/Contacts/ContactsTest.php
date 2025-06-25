<?php

use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('As an user I want to see the full name of the contact', function () {
    $contact = Contact::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    $this->assertEquals('John Doe', $contact->full_name);
});
