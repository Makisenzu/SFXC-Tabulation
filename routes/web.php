<?php

use App\Http\Controllers\admin\ContestantController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\SyncController;
use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\admin\EventController;
use App\Http\Controllers\admin\PermissionController;
use App\Http\Controllers\admin\RoundController;
use App\Http\Controllers\admin\ScoreController;
use App\Http\Controllers\admin\MedalController;
use App\Http\Controllers\admin\ArchiveController;
use App\Http\Controllers\judge\JudgeController;

Route::get('/', [PublicController::class, 'home'])->name('public.home');

// Public routes
Route::get('/medal-tally', [PublicController::class, 'medalTally'])->name('public.medals');
Route::get('/archives', [PublicController::class, 'archives'])->name('public.archives');
Route::get('/archives/{eventId}', [PublicController::class, 'archiveDetails'])->name('public.archive.details');

// API routes for real-time updates
Route::get('/api/medal-tallies', [PublicController::class, 'getMedalTallyData']);

Route::get('/admin', function() {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role_id === 1) {
            return redirect()->route('admin.dashboard');
        }
        return redirect('/');
    }
    return Inertia::render('Auth/Login');
})->name('admin.login');


Route::get('/judge', function() {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role_id === 2) {
            return redirect()->route('judge.dashboard');
        }
        return redirect('/');
    }
    return Inertia::render('Auth/JudgeLogin');
})->name('judge.login');

Route::get('/facilitator', function() {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role_id === 3) {
            return redirect()->route('facilitator.dashboard');
        }
        return redirect('/');
    }
    return Inertia::render('Auth/FacilitatorLogin');
})->name('facilitator.login');


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::get('/getActiveRounds/{id}', [RoundController::class, 'getActiveRounds']);

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


// API Sync routes (for receiving data from local server)
Route::post('/api/sync/receive', [SyncController::class, 'receiveSyncData'])->middleware('sync.api');
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

    Route::get('/admin/medal-tally', function () {
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
    Route::post('/admin/update-score', [ScoreController::class, 'updateScore']);
    Route::post('/admin/notify-judge', [ScoreController::class, 'notifyJudge']);
    Route::post('/admin/import-scores', [ScoreController::class, 'importScoresFromPreviousRound']);
    
    // Debug route to check database data
    Route::get('/debug-scores/{eventId}/{roundNo}', function($eventId, $roundNo) {
        $active = \App\Models\Active::where('event_id', $eventId)->where('round_no', $roundNo)->first();
        if (!$active) {
            return response()->json(['error' => 'Active not found', 'event_id' => $eventId, 'round_no' => $roundNo]);
        }
        
        $rounds = \App\Models\Round::where('active_id', $active->id)->get();
        $roundIds = $rounds->pluck('id')->toArray();
        $tabulations = \App\Models\Tabulation::whereIn('round_id', $roundIds)->get();
        
        return response()->json([
            'active' => $active,
            'rounds_count' => $rounds->count(),
            'rounds' => $rounds,
            'tabulations_count' => $tabulations->count(),
            'tabulations' => $tabulations->take(10)
        ]);
    });
    
    // Test route
    Route::get('/test-notification/{judgeId}', function($judgeId) {
        $notification = [
            'judge_id' => $judgeId,
            'event_id' => 7,
            'event_name' => 'Test Event',
            'round_no' => 1,
            'message' => 'This is a test notification',
            'timestamp' => now()->toDateTimeString()
        ];
        
        event(new \App\Events\JudgeNotification($notification));
        
        return response()->json([
            'success' => true,
            'message' => 'Test notification sent',
            'channel' => 'judge-notifications.' . $judgeId,
            'event' => 'judge.notification'
        ]);
    });

    //medals
    Route::get('/getMedalTallies', [MedalController::class, 'getMedalTallies']);
    Route::get('/getMedalTally/{id}', [MedalController::class, 'getMedalTally']);
    Route::post('/createMedalTally', [MedalController::class, 'createMedalTally']);
    Route::post('/updateMedalScore', [MedalController::class, 'updateScore']);
    Route::delete('/deleteMedalScore/{id}', [MedalController::class, 'deleteScore']);
    Route::delete('/deleteMedalTally/{id}', [MedalController::class, 'deleteMedalTally']);
    Route::get('/printFullMedalTally/{id}', [MedalController::class, 'printFullTally']);
    Route::get('/printCueCards/{id}', [MedalController::class, 'printCueCards']);

    
    //sync
    Route::post('/sync-to-online', [SyncController::class, 'syncToOnline']);

    Route::get('/sync-settings', function () {
        return Inertia::render('Admin/SyncSettings');
    })->name('admin.sync');
    Route::get('/sync-status', [SyncController::class, 'getSyncStatus']);
    //archives
    Route::get('/getArchivedEvents', [ArchiveController::class, 'getArchivedEvents']);
    Route::post('/archiveEvent/{id}', [ArchiveController::class, 'archiveEvent']);
    Route::get('/getArchivedEventDetails/{id}', [ArchiveController::class, 'getArchivedEventDetails']);
    Route::post('/unarchiveEvent/{id}', [ArchiveController::class, 'unarchiveEvent']);
});

Route::middleware(['auth', 'role:Judge'])->group(function () {
    Route::get('/tabulation/dashboard', function (){
        return Inertia::render('Judge/JudgeDashboard');
    })->name('judge.dashboard');

    Route::get('/judge/tabulation-data', [JudgeController::class, 'getTabulationData']);

    Route::patch('/judge/update-score', [JudgeController::class, 'updateScore'])->name('judge.update-score');
    
    Route::post('/judge/request-help', [JudgeController::class, 'requestHelp'])->name('judge.request-help');
});

Route::middleware(['auth', 'role:Facilitator'])->group(function () {
    Route::get('/facilitator/dashboard', function (){
        return Inertia::render('Facilitator/FacilitatorDashboard');
    })->name('facilitator.dashboard');

    Route::get('/facilitator/medal-tallies', [App\Http\Controllers\facilitator\FacilitatorController::class, 'getMedalTallies']);
    Route::post('/facilitator/update-medal-score', [App\Http\Controllers\facilitator\FacilitatorController::class, 'updateMedalScore']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
