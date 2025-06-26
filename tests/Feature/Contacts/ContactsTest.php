<?php

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('As an user I want to see the full name of the contact', function () {
    $contact = Contact::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    $this->assertEquals('John Doe', $contact->full_name);
});

test('As an user I want to see an inertia page with contacts', function () {
    $this->withoutExceptionHandling();
    $user = User::factory()->create();
    $contacts = Contact::factory()->count(5)->create();

    $response = $this
        ->actingAs($user)->get(route('contacts.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('contacts/Index')
        ->has('resource')
        ->where('resource.data.0.id', $contacts->first()->id)
        ->where('resource.data.0.first_name', $contacts->first()->first_name)
        ->where('resource.data.0.full_name', $contacts->first()->full_name)
    );
});
