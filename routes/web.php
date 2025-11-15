<?php

use App\Http\Controllers\admin\ContestantController;
use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\admin\EventController;
use App\Http\Controllers\admin\PermissionController;
use App\Http\Controllers\admin\RoundController;
use App\Http\Controllers\admin\ScoreController;
use App\Http\Controllers\admin\MedalController;
use App\Http\Controllers\judge\JudgeController;

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
Route::get('/getActiveRounds/{id}', [RoundController::class, 'getActiveRounds']);

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/adminDashboard', function () {
        return Inertia::render('Admin/AdminDashboard');
    })->name('admin.dashboard');

    Route::get('/criteria', function () {
        return Inertia::render('Admin/CriteriaDashboard');
    })->name('admin.criteria');

    Route::get('/contestant', function () {
        return Inertia::render('Admin/ContestantDashboard');
    })->name('admin.contestant');

    Route::get('/contestant/perRound', function () {
        return Inertia::render('Admin/CPRDashboard');
    })->name('admin.CPR');

    Route::get('/users', function () {
        return Inertia::render('Admin/UserSection');
    })->name('admin.users');

    Route::get('/archived/events', function () {
        return Inertia::render('Admin/ArchiveDashboard');
    })->name('admin.archive');

    Route::get('/medal-tally', function () {
        return Inertia::render('Admin/MedalDashboard');
    })->name('admin.medal');

    Route::get('/getUsers', [PermissionController::class, 'getUser']);

    Route::post('/add/newUser', [PermissionController::class, 'addUser']);
    Route::delete('/delete/user/{id}', [PermissionController::class, 'deleteUser']);
    Route::patch('/edit/user/{id}', [PermissionController::class, 'updateUser']);

    //events
    Route::post('/addEvent', [EventController::class, 'createEvent']);
    Route::get('/getEvents', [EventController::class, 'showEvents']);
    Route::put('/events/{id}', [EventController::class, 'editEvent']);
    Route::delete('/events/{id}', [EventController::class, 'deleteEvent']);
    Route::get('/getCriterias', [EventController::class, 'showCriteria']);
    Route::post('criterias', [EventController::class, 'createCriteria']);
    Route::patch('/criterias/{id}', [EventController::class, 'editCriteria']);
    Route::delete('criterias/{id}', [EventController::class, 'deleteCriteria']);
    Route::get('/getJudges', [EventController::class, 'getJudges']);
    Route::post('/assign-judge', [EventController::class, 'assignJudge']);

    //contestant
    Route::get('/getContestants', [ContestantController::class, 'getContestants']);
    Route::post('/addContestants', [ContestantController::class, 'createContestants']);
    Route::patch('/contestants/{id}', [ContestantController::class, 'editContestant']);
    Route::delete('/deleteContestant/{id}', [ContestantController::class, 'deleteContestant']);
    Route::post('/contestants/{id}/upload-photo', [ContestantController::class, 'uploadPhoto']);

    //rounds
    Route::post('/contestant-rounds/bulk', [RoundController::class, 'addContestantRound']);
    Route::get('/get-round-contestants/{eventId}/{roundNo}', [RoundController::class, 'getRoundContestants']);
    Route::delete('/contestant-rounds/{contestantId}', [RoundController::class, 'deleteContestant']);
    Route::patch('/events/{id}/set-active-round', [RoundController::class, 'setActiveRound']);
    Route::post('/events/{id}/populate-criteria', [RoundController::class, 'populateTabulationCriteria']);

    //scores and rankings
    Route::get('/getJudgesByEvent/{eventId}', [ScoreController::class, 'getJudgesByEvent']);
    Route::get('/getCriteriaByRound/{eventId}/{roundNo}', [ScoreController::class, 'getCriteriaByRound']);
    Route::get('/getScoresByRound/{eventId}/{roundNo}', [ScoreController::class, 'getScoresByRound']);
    Route::get('/getTabulationDataByRound/{eventId}/{roundNo}', [ScoreController::class, 'getTabulationDataByRound']);
    Route::get('/getOverallRankings/{eventId}/{roundNo}', [ScoreController::class, 'getOverallRankings']);

    //medals
    Route::get('/getMedals', [MedalController::class, 'getMedals']);
    Route::get('/getMedalsByEvent/{eventId}', [MedalController::class, 'getMedalsByEvent']);
    Route::post('/addMedal', [MedalController::class, 'createMedal']);
    Route::patch('/medals/{id}', [MedalController::class, 'updateMedal']);
    Route::delete('/deleteMedal/{id}', [MedalController::class, 'deleteMedal']);
});

Route::middleware(['auth', 'role:Judge'])->group(function () {
    Route::get('/tabulation/dashboard', function (){
        return Inertia::render('Judge/JudgeDashboard');
    })->name('judge.dashboard');

    Route::get('/judge/tabulation-data', [JudgeController::class, 'getTabulationData']);

    Route::patch('/judge/update-score', [JudgeController::class, 'updateScore'])->name('judge.update-score');
    
    Route::post('/judge/request-help', [JudgeController::class, 'requestHelp'])->name('judge.request-help');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
