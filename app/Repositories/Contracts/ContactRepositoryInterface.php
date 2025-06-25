<?php

namespace App\Repositories\Contracts;

use Illuminate\Http\Request;

interface ContactRepositoryInterface
{
    public function getPaginatedContacts(Request $request, int $perPage = 10);
}
