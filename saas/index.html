<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;

// Replace with your OpenAI API key
$openaiApiKey = 'your_openai_api_key';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $prompt = $_POST['prompt'];

    $client = new Client();
    $response = $client->post('https://api.openai.com/v1/engines/davinci-codex/completions', [
        'headers' => [
            'Authorization' => "Bearer {$openaiApiKey}",
            'Content-Type' => 'application/json',
        ],
        'json' => [
            'prompt' => $prompt,
            'max_tokens' => 50,
            'n' => 1,
            'stop' => null,
            'temperature' => 0.7,
        ],
    ]);

    $responseBody = json_decode($response->getBody(), true);
    $generatedText = $responseBody['choices'][0]['text'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPT-3 Text Generation</title>
</head>
<body>
    <h1>GPT-3 Text Generation</h1>
    <form action="/" method="post">
        <label for="prompt">Enter your prompt:</label>
        <input type="text" id="prompt" name="prompt" required>
        <button type="submit">Generate</button>
    </form>
    <?php if (isset($generatedText)): ?>
    <h2>Generated Text:</h2>
    <div>
        <?= htmlspecialchars($generatedText) ?>
    </div>
    <?php endif; ?>
</body>
</html>
