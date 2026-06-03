export default function handler(req, res) {
  // Set CORS headers for RapidAPI
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { pattern, test, flags } = req.query;

    // Validate required params
    if (!pattern || test === undefined) {
      return res.status(200).json({
        valid: false,
        error: "Missing required params: pattern and test",
        pattern: pattern || null,
        flags: flags || "",
        testString: test || null,
        count: 0,
        matches: []
      });
    }

    // Default to 'g' flag if none provided - fixes matchAll crash
    const safeFlags = (flags || 'g').toLowerCase();
    
    // Validate regex
    let regex;
    try {
      regex = new RegExp(pattern, safeFlags);
    } catch (e) {
      return res.status(200).json({
        valid: false,
        error: `Invalid regex: ${e.message}`,
        pattern,
        flags: safeFlags,
        testString: test,
        count: 0,
        matches: []
      });
    }

    // Get matches using matchAll - requires 'g' flag
    const matches = [...test.matchAll(regex)].map(match => ({
      match: match[0],
      index: match.index,
      groups: match.slice(1)
    }));

    return res.status(200).json({
      valid: true,
      pattern,
      flags: safeFlags,
      testString: test,
      count: matches.length,
      matches
    });

  } catch (error) {
    // Never crash. Always return 200 for RapidAPI health checks
    return res.status(200).json({
      valid: false,
      error: `Server error: ${error.message}`,
      pattern: req.query.pattern || null,
      flags: req.query.flags || "",
      testString: req.query.test || null,
      count: 0,
      matches: []
    });
  }
}
