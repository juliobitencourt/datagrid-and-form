<?php

namespace App\Http\Controllers;

use App\Repositories\Contracts\ContactRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactsController extends Controller
{
    /**
     * Display a listing of the contacts.
     */
    public function index(ContactRepositoryInterface $contacts, Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $contactsList = $contacts->getPaginatedContacts($request, $perPage);

        $sort = explode(':', $request->input('sort', ''));

        return Inertia::render('contacts/Index', [
            'resource' => $contactsList,
            'filter' => [
                'search' => $request->input('search', ''),
                'sort' => [
                    [
                        'field' => $sort[0] ?? 'created_at',
                        'direction' => $sort[1] ?? 'desc',
                    ]
                ]
            ],
        ]);
    }
}
