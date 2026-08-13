# Google Form → Google Sheets → Members (auto-sync)

New form submissions flow into the **Members** page automatically. The Google
Sheet that collects the responses runs a small Apps Script that posts every
new row to the site's ingestion endpoint:

```
Google Form ──► Google Sheet ──► Apps Script (onFormSubmit) ──► POST /api/members/from-form ──► Supabase members
```

## 1. Create the import secret (one time)

1. In the Supabase **SQL Editor**, re-run `supabase/schema.sql` (idempotent)
   so the `marital_status` and `whatsapp` columns exist.
2. Add `MEMBER_IMPORT_SECRET` to the site:
   - **Vercel:** Project → Settings → Environment Variables → add
     `MEMBER_IMPORT_SECRET` for Production, then redeploy.
   - **Local:** add it to `.env.local`.
3. Keep the same value — the script below uses it to authenticate.

## 2. Add the script to your sheet

1. Open the Google Sheet linked to your form.
2. **Extensions → Apps Script**.
3. Replace the default `function myFunction() {}` with the code below.
4. **Save** (💾) and name the project e.g. `Members Sync`.

## 3. Set the secret in the script

1. In the Apps Script editor, open **Project Settings (⚙) → Script Properties**.
2. Click **Add property**:
   - Property: `MEMBER_IMPORT_SECRET`
   - Value: your secret from step 1.
3. **Save**.

## 4. Enable the automatic trigger

1. In the Apps Script editor, open **Triggers (⏰) → Add Trigger**.
2. Choose:
   - Function: `onFormSubmit`
   - Event source: **From spreadsheet**
   - Event type: **On form submit**
3. Save — authorize when Google asks (the script posts to your own site only).

## 5. Backfill existing rows (optional)

Your sheet already has old responses. Run them through the API once:

1. In the Apps Script editor, pick `backfillAllMembers` from the function
   dropdown and click **Run** (▶).
2. Authorize, then open **Execution log** to see "Imported X, failed Y".

## 6. Verify

- Submit a test response to the Google Form.
- The member should appear in **Members** (status "new") within seconds.

## Apps Script code

```javascript
/** @OnlyCurrentDoc */
var ENDPOINT = "https://afm-lighthouse-chms.vercel.app/api/members/from-form";

function getSecret_() {
  var secret = PropertiesService.getScriptProperties().getProperty("MEMBER_IMPORT_SECRET");
  if (!secret) throw new Error("MEMBER_IMPORT_SECRET is not set in Script Properties.");
  return secret;
}

function findCol_(headers, tokens) {
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || "").toLowerCase();
    if (tokens.every(function (t) { return h.indexOf(t) !== -1; })) return i;
  }
  return -1;
}

function cell_(row, headers, tokens) {
  var i = findCol_(headers, tokens);
  if (i === -1) return "";
  var v = row[i];
  if (v === undefined || v === null) return "";
  return Array.isArray(v) ? v.join("; ") : String(v).trim();
}

function dateCell_(row, headers, tokens, tz) {
  var i = findCol_(headers, tokens);
  if (i === -1) return "";
  var v = row[i];
  if (v instanceof Date) return Utilities.formatDate(v, tz, "yyyy-MM-dd");
  var s = String(v || "").trim();
  return s === "" ? "" : s;
}

function submitRow_(row, headers) {
  var tz = Session.getScriptTimeZone();
  var payload = {
    name: cell_(row, headers, ["name"]),
    surname: cell_(row, headers, ["surname"]),
    dateOfBirth: dateCell_(row, headers, ["date of birth"], tz),
    residentialAddress: cell_(row, headers, ["residential", "address"]),
    cellNumber: cell_(row, headers, ["cell number"]),
    whatsappNumber: cell_(row, headers, ["whatsapp"]),
    maritalStatus: cell_(row, headers, ["marital status"]),
    spouseName: cell_(row, headers, ["spouse name"]),
    spouseSurname: cell_(row, headers, ["spouse surname"]),
    spouseDateOfBirth: dateCell_(row, headers, ["spouse date of birth"], tz),
    spouseCellNumber: cell_(row, headers, ["spouse cell"]),
    spouseWhatsAppNumber: cell_(row, headers, ["spouse whatsapp"]),
    spouseEmailAddress: cell_(row, headers, ["spouse email"]),
    servingMinistry: cell_(row, headers, ["which ministry", "serving"]),
    volunteerMinistry: cell_(row, headers, ["which ministry", "volunteer"]),
    dateSigned: dateCell_(row, headers, ["date signed"], tz),
    popiaConsent: cell_(row, headers, ["popia"]),
    photoConsent: cell_(row, headers, ["photographs", "permission"]),
    child1Name: cell_(row, headers, ["child 1 name"]),
    child1DateOfBirth: dateCell_(row, headers, ["child 1 date"], tz),
    child2Name: cell_(row, headers, ["child 2 name"]),
    child2DateOfBirth: dateCell_(row, headers, ["child 2 date"], tz),
    child3Name: cell_(row, headers, ["child 3 name"]),
    child3DateOfBirth: dateCell_(row, headers, ["child 3 date"], tz),
    child4Name: cell_(row, headers, ["child 4 name"]),
    child4DateOfBirth: dateCell_(row, headers, ["child 4 date"], tz)
  };

  var response = UrlFetchApp.fetch(ENDPOINT, {
    method: "post",
    contentType: "application/json",
    headers: { "x-import-secret": getSecret_() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) {
    throw new Error("Import failed (" + response.getResponseCode() + "): " + response.getContentText());
  }
}

/** Runs automatically on every new form submission. */
function onFormSubmit(e) {
  var sheet = e.range.getSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  submitRow_(e.range.getValues()[0], headers);
}

/** Imports every existing row once. Run from the editor, watch Execution log. */
function backfillAllMembers() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  var ok = 0, failed = 0;
  for (var i = 0; i < rows.length; i++) {
    try {
      submitRow_(rows[i], headers);
      ok++;
    } catch (err) {
      failed++;
      Logger.log("Row " + (i + 2) + " failed: " + err);
    }
  }
  Logger.log("Imported " + ok + ", failed " + failed);
}
```

## Field mapping (auto-matched by header name)

| Form field | Members column |
|---|---|
| Name / Surname | first_name / last_name |
| Date of Birth | birthday (YYYY-MM-DD) |
| Residential Address | address |
| Cell Number / WhatsApp | phone / whatsapp |
| Marital Status | marital_status |
| Spouse details | family (relation "Spouse") |
| Spouse Date of Birth | family (spouse birthday — shows on dashboard) |
| Child 1–4 Name + DOB | children (with age + birthday) |
| Ministry serving in | ministries |
| Wants to volunteer | volunteer_status = "volunteer" |
| Date Signed | joined_at |
| POPIA consent, photo consent | notes |

Importing members land as **status "new"** so the office can process them.
Duplicate submissions update the existing member (matched on cell number).

### Spouse & child birthdays on the dashboard

The dashboard shows birthdays for members **and** their spouses and children:

- **Children**: the form already collects "Child 1–4 Name + Date of Birth" — those
  dates are now stored and shown. No form change needed.
- **Spouse**: add a **"Spouse Date of Birth"** question to the Google Form (Date
  response) if it isn't there already, then update the Apps Script in your sheet
  with the `spouseDateOfBirth` line above.

To backfill birth dates for existing rows (e.g. after adding the spouse question),
run `backfillAllMembers` again — the upsert matches on cell number and refreshes
each member's family details.
