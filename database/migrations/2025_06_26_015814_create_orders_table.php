<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            // Address fields
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('postal_code');
            $table->string('country');
            // Contact fields
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            // Payment fields
            $table->string('payment_method'); // e.g., credit card, PayPal
            $table->string('payment_status')->default('unpaid'); // e.g., unpaid, paid, refunded
            $table->date('order_date')->useCurrent();
            $table->decimal('total_amount', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
