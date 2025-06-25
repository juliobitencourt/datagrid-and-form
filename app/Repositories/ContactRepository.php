<?php

namespace App\Repositories;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Repositories\Contracts\ContactRepositoryInterface;

class ContactRepository implements ContactRepositoryInterface
{
    public function __construct(protected Contact $model)
    {
    }

    public function getPaginatedContacts(Request $request, int $perPage = 10)
    {
        return $this->model::query()
            ->when($request->input('search'), function ($query, $search) {
                return $query
                    ->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn ($contact) => [
                'id' => $contact->id,
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'email' => $contact->email,
                'phone' => $contact->phone,
                'birth_date' => $contact->birth_date?->format('Y-m-d'),
                'visits' => $contact->visits,
                'full_name' => $contact->full_name,
                'created_at' => $contact->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $contact->updated_at?->format('Y-m-d H:i:s'),
            ]);
    }
}
