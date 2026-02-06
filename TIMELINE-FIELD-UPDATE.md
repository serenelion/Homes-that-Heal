# Timeline Field Addition - Waitlist Form
## Homes That Heal Website

**Date:** 2026-02-05  
**Website:** `/Users/arye/projects/homes-that-heal-website/`

---

## ✅ CHANGE SUMMARY

### Added Mandatory Timeline Field to Waitlist Form

**Purpose:** Qualify leads by project urgency and readiness

**Field Type:** Required dropdown (select)

**Location:** After Budget Range, before Updates checkbox

---

## 📋 TIMELINE OPTIONS

```html
<select id="timeline" name="timeline" required>
    <option value="">When are you looking to start?</option>
    <option value="immediate">Immediate (0-3 months)</option>
    <option value="near-term">Near-term (3-6 months)</option>
    <option value="mid-term">Mid-term (6-12 months)</option>
    <option value="long-term">Long-term (12-24 months)</option>
    <option value="exploring">Exploring (24+ months)</option>
</select>
```

### Option Breakdown:

| Value | Label | Urgency | Use Case |
|-------|-------|---------|----------|
| `immediate` | Immediate (0-3 months) | **High** | Ready to start Discovery Kit now |
| `near-term` | Near-term (3-6 months) | **Medium-High** | Planning phase, ready to commit soon |
| `mid-term` | Mid-term (6-12 months) | **Medium** | Serious interest, longer planning horizon |
| `long-term` | Long-term (12-24 months) | **Low-Medium** | Early research, future project |
| `exploring` | Exploring (24+ months) | **Low** | Gathering information, no immediate plans |

---

## 🎯 LEAD QUALIFICATION BENEFITS

### Sales Prioritization:
- **Immediate (0-3 months):** Priority follow-up, ready for Discovery Kit
- **Near-term (3-6 months):** Warm leads, nurture with content
- **Mid-term (6-12 months):** Long-term nurture, quarterly check-ins
- **Long-term (12-24 months):** Education-focused communication
- **Exploring (24+ months):** Newsletter only, low-touch

### Pipeline Management:
- Segment leads by timeline in CRM
- Forecast project starts by quarter
- Allocate resources based on near-term volume
- Identify seasonal trends in timelines

### Marketing Automation:
- **Immediate:** Send Discovery Kit details immediately
- **Near-term:** 3-part email series on process
- **Mid-term:** Monthly design inspiration + case studies
- **Long-term:** Quarterly newsletter + webinar invites
- **Exploring:** Monthly newsletter, educational content

---

## 📊 UPDATED FORM DATA STRUCTURE

```javascript
{
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  projectType: "home-renovation" | "new-home-build" | "impact-cre",
  budget: "5k-50k" | "50k-150k" | "150k-500k" | "500k-2m" | "2m-10m" | "10m-50m" | "50m+",
  timeline: "immediate" | "near-term" | "mid-term" | "long-term" | "exploring",  // NEW
  updates: boolean,
  timestamp: "ISO 8601 string",
  source: "homes-that-heal.com"
}
```

---

## 💼 SALES USE CASES

### Scenario 1: High-Priority Lead
**Data:**
- Budget: $150k-500k
- Project: Home Renovation
- Timeline: **Immediate (0-3 months)**

**Action:**
- ✅ Call within 24 hours
- ✅ Send Discovery Kit details via email
- ✅ Schedule consultation call
- ✅ Mark as hot lead in CRM

---

### Scenario 2: Mid-Pipeline Lead
**Data:**
- Budget: $2M-10M
- Project: New Home Build
- Timeline: **Mid-term (6-12 months)**

**Action:**
- ✅ Send welcome email with case studies
- ✅ Add to quarterly webinar invites
- ✅ Monthly check-in emails
- ✅ Mark for follow-up in 4-6 months

---

### Scenario 3: Long-Term Nurture
**Data:**
- Budget: $50k-150k
- Project: Home Renovation
- Timeline: **Exploring (24+ months)**

**Action:**
- ✅ Add to newsletter list
- ✅ Share educational content only
- ✅ No active sales outreach
- ✅ Check-in annually

---

## 🔧 TECHNICAL IMPLEMENTATION

### HTML (form field):
```html
<div class="form-group">
    <label for="timeline">Project Timeline *</label>
    <select id="timeline" name="timeline" required>
        <option value="">When are you looking to start?</option>
        <option value="immediate">Immediate (0-3 months)</option>
        <option value="near-term">Near-term (3-6 months)</option>
        <option value="mid-term">Mid-term (6-12 months)</option>
        <option value="long-term">Long-term (12-24 months)</option>
        <option value="exploring">Exploring (24+ months)</option>
    </select>
</div>
```

### JavaScript (validation):
```javascript
const formData = {
    // ... other fields
    timeline: form.timeline.value,  // NEW
    // ... rest of fields
};

// Validation includes timeline
if (!formData.firstName || !formData.lastName || !formData.email || 
    !formData.phone || !formData.projectType || !formData.budget || 
    !formData.timeline) {  // NEW
    alert('Please fill in all required fields.');
    return;
}
```

### CSV Export (updated headers):
```javascript
const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 
    'Project Type', 'Budget', 'Timeline',  // NEW
    'Updates', 'Timestamp'
];

const rows = data.map(entry => [
    entry.firstName,
    entry.lastName,
    entry.email,
    entry.phone || 'N/A',
    entry.projectType || 'N/A',
    entry.budget || 'N/A',
    entry.timeline || 'N/A',  // NEW
    entry.updates ? 'Yes' : 'No',
    new Date(entry.timestamp).toLocaleString()
]);
```

---

## 📈 EXPECTED OUTCOMES

### Lead Quality:
- **Better qualification:** Timeline signals readiness to buy
- **Reduced waste:** Don't chase leads that won't convert soon
- **Accurate forecasting:** Project starts mapped to quarters

### Sales Efficiency:
- **Prioritize outreach:** Focus on immediate/near-term first
- **Segment communication:** Different cadence for different timelines
- **Resource allocation:** Staff up based on near-term pipeline

### Marketing Insights:
- **Seasonality trends:** When do most people plan projects?
- **Budget-timeline correlation:** Do higher budgets have longer timelines?
- **Project-timeline patterns:** Do renovations move faster than new builds?

---

## 🎨 FORM FIELD ORDER

**Current Complete Order:**

1. **First Name** * (text)
2. **Last Name** * (text)
3. **Email Address** * (email)
4. **Phone Number** * (tel)
5. **Project Type** * (dropdown) - home-renovation | new-home-build | impact-cre
6. **Budget Range** * (dropdown) - $5K to $50M+
7. **Project Timeline** * (dropdown) - immediate to exploring
8. **Updates** (checkbox) - opt-in for communications

**Total Fields:** 8 (7 required + 1 optional)

**Form Length:** Balanced - enough to qualify, not overwhelming

---

## 📊 DATA ANALYSIS OPPORTUNITIES

### Pipeline Velocity:
```sql
-- Example query concept
SELECT timeline, COUNT(*) as leads, AVG(budget) as avg_budget
FROM waitlist
GROUP BY timeline
ORDER BY FIELD(timeline, 'immediate', 'near-term', 'mid-term', 'long-term', 'exploring');
```

### Conversion Funnel:
- What % of "immediate" leads convert to Discovery Kit?
- What % of "near-term" leads convert within 6 months?
- Do "exploring" leads ever convert? (ROI on nurture)

### Seasonal Patterns:
- Do "immediate" timelines spike in spring (building season)?
- Do "long-term" timelines increase in winter (planning season)?

---

## 🚀 CRM INTEGRATION EXAMPLES

### HubSpot:
```javascript
// Example property mapping
{
  "properties": {
    "firstname": formData.firstName,
    "lastname": formData.lastName,
    "email": formData.email,
    "phone": formData.phone,
    "project_type": formData.projectType,
    "budget_range": formData.budget,
    "project_timeline": formData.timeline,  // Custom property
    "opted_in": formData.updates
  }
}
```

### Airtable:
```javascript
// Example field mapping
{
  "fields": {
    "First Name": formData.firstName,
    "Last Name": formData.lastName,
    "Email": formData.email,
    "Phone": formData.phone,
    "Project Type": formData.projectType,
    "Budget": formData.budget,
    "Timeline": formData.timeline,  // Single select field
    "Updates": formData.updates,
    "Timestamp": formData.timestamp
  }
}
```

### Salesforce:
```javascript
// Example lead object
{
  "FirstName": formData.firstName,
  "LastName": formData.lastName,
  "Email": formData.email,
  "Phone": formData.phone,
  "Project_Type__c": formData.projectType,
  "Budget_Range__c": formData.budget,
  "Project_Timeline__c": formData.timeline,  // Custom field
  "Lead_Source": "Homes That Heal Website"
}
```

---

## ✅ TESTING CHECKLIST

- [x] Field renders in modal form
- [x] Required validation works (cannot submit without selection)
- [x] All 5 timeline options selectable
- [x] Data captured in formData object
- [x] Validation includes timeline check
- [x] localStorage stores timeline
- [x] CSV export includes timeline column
- [x] Form resets timeline on modal close

---

## 💡 FUTURE ENHANCEMENTS

### Conditional Logic:
- If timeline = "immediate" → Show "Book Discovery Call Now" button
- If timeline = "exploring" → Show "Download Free Guide" instead

### Smart Defaults:
- Based on budget, suggest typical timeline
- E.g., $50M+ projects typically 12-24 months

### Follow-Up Automation:
- Email sequence triggered by timeline selection
- SMS reminder for immediate leads after 48 hours

### Analytics Dashboard:
- Timeline distribution visualization
- Budget vs. timeline correlation chart
- Conversion rate by timeline segment

---

## 📁 FILES MODIFIED

1. **index.html**
   - Added timeline field after budget, before checkbox
   - 5 timeline options (immediate → exploring)

2. **script.js**
   - Added timeline to formData object
   - Updated validation to include timeline
   - Updated CSV headers and row mapping

3. **TIMELINE-FIELD-UPDATE.md**
   - This documentation file

---

## 🔗 QUICK REFERENCE

**Field ID:** `timeline`  
**Field Name:** `timeline`  
**Field Type:** `<select>` (required)  
**Values:** `immediate | near-term | mid-term | long-term | exploring`

**Test Form:**
1. Open modal (Join Waitlist button)
2. Scroll to see timeline field
3. Try submitting without selecting → Should see validation error
4. Select a timeline → Should submit successfully

**View Submitted Data:**
```javascript
HomesHealWaitlist.getData()
```

**Export with Timeline:**
```javascript
HomesHealWaitlist.exportCSV()  // Includes timeline column
```

---

**Timeline field is now live!** Refresh to see the new field in the waitlist form. This will help you qualify leads by urgency and optimize your sales follow-up strategy. 🐆
