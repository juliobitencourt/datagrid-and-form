<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\Orders\OrdersController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('contacts', [ContactsController::class, 'index'])->middleware(['auth', 'verified'])->name('contacts.index');

Route::middleware(['auth', 'verified'])->prefix('orders')->name('orders.')->group(function () {
    Route::get('/', [OrdersController::class, 'create'])->name('create');
    Route::post('/', [OrdersController::class, 'store'])->name('store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
