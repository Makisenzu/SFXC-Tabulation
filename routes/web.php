<?php

use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\admin\PermissionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/admin', function() {
    return Inertia::render('Auth/Login');
})->name('admin.login');


Route::get('/judge', function() {
    return Inertia::render('Auth/JudgeLogin');
})->name('judge.login');


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/adminDashboard', function () {
        return Inertia::render('Admin/AdminDashboard');
    })->name('admin.dashboard');

    Route::get('/users', function () {
        return Inertia::render('Admin/UserSection');
    })->name('admin.users');

    Route::get('/criteria', function () {
        return Inertia::render('Admin/CriteriaDashboard');
    })->name('admin.criteria');

    Route::get('/getUsers', [PermissionController::class, 'getUser']);

    Route::post('/add/newUser', [PermissionController::class, 'addUser']);
    Route::delete('/delete/user/{id}', [PermissionController::class, 'deleteUser']);
    Route::patch('/edit/user/{id}', [PermissionController::class, 'updateUser']);
});

Route::middleware(['auth', 'role:Judge'])->group(function () {
    Route::get('/tabulation/dashboard', function (){
        return Inertia::render('Judge/JudgeDashboard');
    })->name('judge.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
