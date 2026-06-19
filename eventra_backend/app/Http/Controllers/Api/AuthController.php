<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function signup(Request $request)
    {
        // Normalize camelCase fields from frontend
        if ($request->has('organizationName')) {
            $request->merge(['organization_name' => $request->organizationName]);
        }
        if ($request->has('contactInfo')) {
            $request->merge(['contact_info' => $request->contactInfo]);
        }
        if ($request->has('confirmPassword')) {
            $request->merge(['password_confirmation' => $request->confirmPassword]);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:admin,organizer,participant',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = $request->role;
        $extraData = [];

        // Validate role-specific dynamic fields
        if ($role === 'participant') {
            $extraValidator = Validator::make($request->all(), [
                'interests' => 'required|string',
                'location' => 'required|string',
            ]);
            if ($extraValidator->fails()) {
                return response()->json(['errors' => $extraValidator->errors()], 422);
            }
            $extraData = [
                'interests' => $request->interests,
                'location' => $request->location,
                'status' => 'approved', // Participants are automatically approved
            ];
        } elseif ($role === 'organizer') {
            $extraValidator = Validator::make($request->all(), [
                'organization_name' => 'required|string',
                'contact_info' => 'required|string',
            ]);
            if ($extraValidator->fails()) {
                return response()->json(['errors' => $extraValidator->errors()], 422);
            }
            $extraData = [
                'organization_name' => $request->organization_name,
                'contact_info' => $request->contact_info,
                'status' => 'pending', // Organizers require admin approval
            ];
        }

        $user = User::create(array_merge([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $role,
            'password' => Hash::make($request->password),
        ], $extraData));

        // For Phase 1 API design, return a mock JWT token and user info
        $token = 'MOCK_JWT_TOKEN_' . Str::random(24);

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'interests' => $user->interests,
                'location' => $user->location,
                'organizationName' => $user->organization_name,
                'organization_name' => $user->organization_name,
                'contactInfo' => $user->contact_info,
                'contact_info' => $user->contact_info,
            ]
        ], 201);
    }

    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password.'], 401);
        }

        if ($user->role === 'organizer' && $user->status === 'pending') {
            return response()->json(['message' => 'Your account is pending administrator approval.'], 403);
        }

        if ($user->status === 'rejected') {
            return response()->json(['message' => 'Your account registration was rejected.'], 403);
        }

        $token = 'MOCK_JWT_TOKEN_' . Str::random(24);
        $adminAutologinToken = null;

        if ($user->role === 'admin') {
            $adminAutologinToken = Str::random(60);
            $user->remember_token = $adminAutologinToken;
            $user->save();
        }

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'adminAutologinToken' => $adminAutologinToken,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'interests' => $user->interests,
                'location' => $user->location,
                'organizationName' => $user->organization_name,
                'organization_name' => $user->organization_name,
                'contactInfo' => $user->contact_info,
                'contact_info' => $user->contact_info,
            ]
        ]);
    }
}
