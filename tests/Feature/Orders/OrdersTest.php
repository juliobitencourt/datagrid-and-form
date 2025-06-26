<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('As an user I want to create an order', function () {
    $this->withoutExceptionHandling();

    $user = User::factory()->create();
    $orderData = [
        'address_line_1' => '123 Main St',
        'address_line_2' => 'Apt 4B',
        'city' => 'Springfield',
        'state' => 'IL',
        'postal_code' => '62701',
        'country' => 'USA',
        'contact_name' => 'Jane Doe',
        'contact_email' => 'janedoe@example.com',
        'contact_phone' => '555-1234',
        'payment_method' => 'credit_card',
        'payment_status' => 'unpaid',
        'order_date' => now(),
        'total_amount' => 99.99,
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('orders.store'), $orderData);

    $response->assertRedirect(route('orders.index'));
    $response->assertSessionHas('success', 'Order created successfully!');
    $this->assertDatabaseHas('orders', $orderData);
});

test('As an user I want to see errors if the payload is invalid', function () {
    $user = User::factory()->create();
    $orderData = [
        'address_line_1' => '123 Main St',
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('orders.store'), $orderData);

    $response->assertSessionHasErrors([
        'city',
        'state',
        'postal_code',
        'country',
        'contact_name',
        'contact_email',
        'payment_method',
        'total_amount',
    ]);
});
