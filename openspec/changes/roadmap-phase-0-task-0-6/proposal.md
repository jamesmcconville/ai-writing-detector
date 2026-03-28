## Why

Sample texts are essential for testing the detector. We need both AI-generated and human-written samples to validate detection accuracy and calibrate scoring thresholds.

## What Changes

- Add 3-5 AI-generated sample texts in `samples/ai-generated/`
- Add 3-5 human-written sample texts in `samples/human-written/`
- Include diverse topics and writing styles

## Capabilities

### New Capabilities

- `sample-texts`: Test corpus of AI-generated and human-written texts for detector validation

### Modified Capabilities

None - this is test data.

## Impact

- Creates sample text files in `samples/` subdirectories
- Enables testing with realistic input data
- No breaking changes - test data only
