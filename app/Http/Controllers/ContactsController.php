<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Repositories\Contracts\ContactRepositoryInterface;

class ContactsController extends Controller
{
    /**
     * Display a listing of the contacts.
     */
    public function index(ContactRepositoryInterface $contacts, Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $contactsList = $contacts->getPaginatedContacts($request, $perPage);

        return Inertia::render('contacts/Index', [
            'resource' => $contactsList,
            'filters' => ['search' => $request->input('search', '')],
        ]);
    }
}
