<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Repositories\Contracts\ContactRepositoryInterface;
use Illuminate\Http\Request;

class ContactRepository implements ContactRepositoryInterface
{
    public function __construct(
        protected Contact $model,
        protected array $validFields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'birth_date', 'visits', 'created_at', 'updated_at',
        ],
    ) {}

    public function getPaginatedContacts(Request $request, int $perPage = 10)
    {
        return $this->model::query()
            ->when($request->input('search'), function ($query, $search) {
                return $query
                    ->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            })
            ->when($request->input('sort'), function ($query, $sort) {
                $sortFields = explode('|', $sort);
                foreach ($sortFields as $sortField) {
                    $field = explode(':', $sortField)[0];
                    if (! in_array($field, $this->validFields)) {
                        continue; // Skip invalid fields
                    }
                    $direction = explode(':', $sortField)[1] == 'desc' ? 'desc' : 'asc';
                    $query->orderBy($field, $direction);
                }

                return $query;
            }, function ($query) {
                return $query->orderBy('created_at', 'desc');
            })
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
