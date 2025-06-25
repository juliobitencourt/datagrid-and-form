<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactsController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('contacts', [ContactsController::class, 'index'])->middleware(['auth', 'verified'])->name('contacts.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
