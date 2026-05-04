# AI Election Assistant - Rule-based responses
# Topics: Election process, Voting system, Voter registration, Election timeline, Government formation

def ai_chat(user_message, location, election_data):
    user_msg = user_message.lower().strip()
    if location is None:
        location = {}
    country = location.get('country', 'General').upper()
    
    # Topic keywords to responses (short, simple English, 5-10 lines max)
    topics = {
        'election process': {
            'response': '''Election process has 7 main steps:
1. Voter registration
2. Candidate nomination  
3. Campaign period
4. Silent period (no campaigning)
5. Voting day
6. Vote counting
7. Results and government formation.
This ensures fair elections.''',
            'summary': 'Election has 7 steps from registration to government formation.',
            'citations': []
        },
        'voting system': {
            'response': '''Voting system uses electronic voting machines (EVMs).
Voters press button for candidate.
Votes are secret and counted electronically.
Results are fast and accurate.
Paper trail available for verification.
Ensures no tampering.''',
            'summary': 'Electronic voting with EVMs, secret ballot, electronic counting.',
            'citations': []
        },
        'voter registration': {
            'response': '''To register as voter:
1. Be 18+ years old on voting date
2. Apply online or at election office
3. Submit ID proof (Aadhaar/Passport)
4. Get voter ID card
5. Check status online.
Register early before deadline!''',
            'summary': 'Be 18+, apply online/office with ID, get voter ID.',
            'citations': []
        },
        'election timeline': {
            'response': '''Typical timeline:
- Notification: 6 months before
- Nomination: 30 days before
- Campaign: Starts after nomination
- Silent period: 48 hours before
- Voting: Election day
- Results: Next day
Deadlines vary by election.''',
            'summary': 'Notification 6mo, nomination 30d, campaign, silent 48h, vote, results next day.',
            'citations': []
        },
        'government formation': {
            'response': '''After results:
1. Party with most seats forms government
2. Leader becomes Chief Minister/PM
3. Forms cabinet with MLAs/MPs
4. Governor/President invites to form govt
5. Trust vote in assembly within 30 days.
Coalition if no majority.''',
            'summary': 'Winning party forms govt, leader sworn in, trust vote in 30 days.',
            'citations': []
        }
    }
    
    # Match topic (first best match)
    matched_topic = None
    for topic, info in topics.items():
        if any(word in user_msg for word in topic.split()):
            matched_topic = info
            break
    
    if matched_topic:
        citations = matched_topic['citations']
    else:
        # Guide for unclear
        response = '''Your question is unclear. Try asking about:
- Election process
- Voting system  
- Voter registration
- Election timeline
- Government formation
I can help with these topics!'''
        summary = 'Please ask about specific election topics listed.'
        citations = []
        matched_topic = {'response': response, 'summary': summary, 'citations': citations}
    
    # Fixed buttons as per rules
    interaction_buttons = [
        {"label": "More details"},
        {"label": "Explain simply"}
    ]
    
    return {
        "response": matched_topic['response'],
        "summary": matched_topic['summary'],
        "interaction_buttons": interaction_buttons,
        "citations": citations
    }

