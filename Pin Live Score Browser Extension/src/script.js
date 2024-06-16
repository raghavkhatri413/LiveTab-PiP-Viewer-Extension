// Function to fetch live score data from Google's page
async function getLiveScoreData() {
    console.log('Fetching live score data...');
    const liveScoreElement = document.querySelector('.imso_mh__tm-scr.imso_mh__mh-bd');

    if (!liveScoreElement) {
        console.error('Live score element not found.');
        return null;
    }

    const tournamentElement = liveScoreElement.querySelector('.imso-loa.imso-ln');
    const matchStartElement = liveScoreElement.querySelector('.imso_mh__lr-dt-ds');

    const team1Element = liveScoreElement.querySelector('.imso_mh__tm-nm-ew[data-dtype="d3sen"]:not(.liveresults-sports-immersive__hide-element) span');
    const team2Element = liveScoreElement.querySelectorAll('.imso_mh__tm-nm-ew[data-dtype="d3sen"]:not(.liveresults-sports-immersive__hide-element) span')[1];
    const score1Element = liveScoreElement.querySelector('.imspo_mh_cricket__score-major');
    const score2Element = liveScoreElement.querySelector('.imspo_mh_cricket__second-score .imspo_mh_cricket__score-major');
    const overs1Element = liveScoreElement.querySelector('.imspo_mh_cricket__score-minor');
    const overs2Element = liveScoreElement.querySelector('.imspo_mh_cricket__second-score .imspo_mh_cricket__score-minor');
    const liveStatusElement = liveScoreElement.querySelector('.imso_mh__lv-m-stts-cont span');
    const batsman1Element = liveScoreElement.querySelector('.imspo_mh_cricket__left-team div:nth-child(2)');
    const batsman2Element = liveScoreElement.querySelector('.imspo_mh_cricket__left-team div:nth-child(3)');

    const liveScoreData = {
        tournamentName: tournamentElement ? tournamentElement.textContent.trim() : '',
        matchStartTime: matchStartElement ? matchStartElement.textContent.trim() : '',
        team1: team1Element ? team1Element.textContent.trim() : '',
        team2: team2Element ? team2Element.textContent.trim() : '',
        score1: score1Element ? score1Element.textContent.trim() : '',
        score2: score2Element ? score2Element.textContent.trim() : '',
        overs1: overs1Element ? overs1Element.textContent.trim() : '',
        overs2: overs2Element ? overs2Element.textContent.trim() : '',
        liveStatus: liveStatusElement ? liveStatusElement.textContent.trim() : '',
        batsman1: batsman1Element ? batsman1Element.textContent.trim() : '',
        batsman2: batsman2Element ? batsman2Element.textContent.trim() : ''
    };

    console.log('Live score data fetched:', liveScoreData);
    return liveScoreData;
}

function createVideoElement() {
    const video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);
    return video;
}

function drawLiveScoreOnCanvas(context, liveScoreData) {
    console.log('Drawing live score on canvas...');
    context.clearRect(0, 0, 640, 360); // Clear the canvas

    // Apply CSS styles directly to the canvas element
    context.fillStyle = '#2c3e50'; // Background color (dark blue-gray)
    context.fillRect(0, 0, 640, 360); // Fill the canvas with dark background

    // Define colors for the team names and scores
    const team1Color = '#e74c3c'; // Team 1 name color (red)
    const team2Color = '#3498db'; // Team 2 name color (blue)
    const battingTeamColor = '#f1c40f'; // Batting team color (yellow)
    const scoreColor = '#f1c40f'; // Score color (yellow)
    const nonBattingTeamColor = '#ffffff'; // Non-batting team score color (white)
    const liveStatusColor = '#e74c3c'; // Live status color (red)

    // Define font styles
    const scoreFont = 'bold 45px Roboto, Arial, sans-serif'; // Bold font for scores
    const teamFont = '35px Roboto, Arial, sans-serif'; // Font for team names
    const additionalInfoFont = '25px Roboto, Arial, sans-serif'; // Font for additional info
    const batsmanFont = '25px Roboto, Arial, sans-serif'; // Font for batsmen names and scores

    context.textAlign = 'center'; // Center text horizontally
    context.textBaseline = 'middle'; // Center text vertically

    // Calculate center positions
    const centerX = 320; // Half of canvas width
    const centerY = 180; // Half of canvas height

    // Display live status in upper right corner
    context.font = additionalInfoFont;
    context.fillStyle = liveStatusColor;
    context.fillText(liveScoreData.liveStatus, 600, 25);

    // Display team1 score and name
    context.font = scoreFont;
    context.fillStyle = battingTeamColor;
    context.fillText(liveScoreData.score1 + ' ' + liveScoreData.overs1, centerX - 160, centerY - 50);

    context.font = teamFont;
    context.fillStyle = team1Color;
    context.fillText(liveScoreData.team1, centerX - 160, centerY + 15);

    // Display team2 score and name
    context.font = scoreFont;
    context.fillStyle = nonBattingTeamColor;
    context.fillText(liveScoreData.score2+' '  + liveScoreData.overs2, centerX + 160, centerY - 50);

    context.font = teamFont;
    context.fillStyle = team2Color;
    context.fillText(liveScoreData.team2, centerX + 160, centerY + 15);

    // Display v/s text
    context.font = teamFont;
    context.fillStyle = '#ffffff'; // White text color for "v/s"
    context.fillText('v/s', centerX, centerY);

    // Display match start time and tournament name
    context.font = additionalInfoFont;
    context.fillStyle = '#ffffff'; // White text color
    context.fillText(liveScoreData.matchStartTime, 320, 50);
    context.fillText(liveScoreData.tournamentName, 320, 310);

    // Display batsmen names and scores
    context.font = batsmanFont;
    context.fillStyle = battingTeamColor;
    context.fillText(liveScoreData.batsman1, centerX - 160, centerY + 65);
    context.fillText(liveScoreData.batsman2, centerX - 160, centerY + 115);

    console.log('Canvas updated with live score data');
}

// Function to start Picture-in-Picture mode
async function startPictureInPicture(video) {
    try {
        if (document.pictureInPictureEnabled) {
            await video.requestPictureInPicture();
            console.log('Entered Picture-in-Picture mode');
        } else {
            console.error('Picture-in-Picture is not supported in this browser.');
        }
    } catch (error) {
        console.error('Error entering Picture-in-Picture mode:', error);
    }
}

(async () => {
    const liveScoreData = await getLiveScoreData();
    if (!liveScoreData) {
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 640; // Decrease canvas width
    canvas.height = 360; // Decrease canvas height
    const context = canvas.getContext('2d');
    const video = createVideoElement();

    // Draw the live score on the canvas every second
    setInterval(async () => {
        const updatedLiveScoreData = await getLiveScoreData();
        if (updatedLiveScoreData) {
            drawLiveScoreOnCanvas(context, updatedLiveScoreData);
        }
    }, 1000);

    const stream = canvas.captureStream();
    video.srcObject = stream;
    await video.play();

    await startPictureInPicture(video);
})();
