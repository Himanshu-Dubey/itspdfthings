<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const DISPOSABLE_DOMAINS = [
        'guerrillamail.com','guerrillamail.net','guerrillamail.org',
        'tempmail.com','temp-mail.org','temp-mail.io','tempail.com',
        'throwaway.email','throwawaymail.com','throwam.com',
        'mailinator.com','mailnesia.com','maildrop.cc','mailcatch.com',
        'yopmail.com','yopmail.fr','yopmail.net',
        'dispostable.com','sharklasers.com','guerrillamailblock.com',
        'grr.la','disposable.email','mohmal.com',
        'fakeinbox.com','tempinbox.com','tempr.email',
        '10minutemail.com','10minutemail.co.za','mailnator.com',
        'trashmail.com','trashmail.net','trashmail.me','trashmail.org',
        'discard.email','discardmail.com','discardmail.de',
        'getairmail.com','getnada.com','emailondeck.com',
        'tmpmail.net','tmpmail.org','tmpmail.me',
        'harakirimail.com','jetable.org','jetable.fr.nf',
        'mytemp.email','tempemail.net','tempemail.com',
        'spamgourmet.com','spamgourmet.net','spamgourmet.org',
        'binkmail.com','bobmail.info','chammy.info','devnullmail.com',
        'letthemeatspam.com','meltmail.com','nospam.ze.tc',
        'nomail.xl.cx','sslmails.com','safetymail.info',
    ];

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'hp'       => ['sometimes', 'string', 'max:0'],
            'ts'       => ['required', 'numeric'],
        ]);

        // Honeypot check — bots fill hidden fields
        if (!empty($data['hp'])) {
            abort(422, 'Registration failed.');
        }

        // Time check — reject if submitted faster than 3 seconds
        $elapsed = time() - intval($data['ts']);
        if ($elapsed < 3) {
            abort(422, 'Registration failed. Please try again.');
        }

        // Disposable email check
        $domain = strtolower(trim(substr(strrchr($data['email'], '@'), 1)));
        if (in_array($domain, self::DISPOSABLE_DOMAINS, true)) {
            throw ValidationException::withMessages([
                'email' => ['Please use a permanent email address.'],
            ]);
        }

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json(['user' => Auth::user()]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.']);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'name'             => ['sometimes', 'string', 'max:255'],
            'current_password' => ['required_with:password', 'string'],
            'password'         => ['sometimes', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if ($request->filled('password')) {
            if (! Hash::check($request->input('current_password'), $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
                ]);
            }
            $user->password = Hash::make($request->input('password'));
        }

        if ($request->filled('name')) {
            $user->name = $request->input('name');
        }

        $user->save();

        return response()->json(['user' => $user]);
    }

    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $user = $request->user();

        if ($user->avatar && !str_ends_with($user->avatar, '/')) {
            $oldPath = storage_path('app/public/' . $user->avatar);
            if (is_file($oldPath)) {
                unlink($oldPath);
            }
        }

        $file = $request->file('avatar');
        $randomName = Str::random(40) . '.webp';
        $destPath = storage_path('app/public/avatars/' . $randomName);

        $imagick = new \Imagick($file->getRealPath());
        $imagick->setImageFormat('webp');
        $imagick->setImageCompressionQuality(80);

        $width = $imagick->getImageWidth();
        $height = $imagick->getImageHeight();
        $maxSize = 256;

        if ($width > $maxSize || $height > $maxSize) {
            $imagick->thumbnailImage($maxSize, $maxSize, true);
        }

        file_put_contents($destPath, $imagick->getImageBlob());
        $imagick->destroy();

        $user->avatar = 'avatars/' . $randomName;
        $user->save();

        return response()->json([
            'user' => $user,
            'avatar_url' => '/api/avatar/' . $user->id,
        ]);
    }
}
