<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'to_email' => ['required', 'email'],
            'amount' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
