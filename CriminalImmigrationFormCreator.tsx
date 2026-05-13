import { useState } from 'react';
import { FileText, Copy, Check, Scale, Sparkles, ChevronDown, ClipboardList } from 'lucide-react';

// ── Shared attorney info ─────────────────────────────────────────────────────
const ATTORNEY = {
  name: 'Anna Victoria Quinones Barr',
  firm: 'VICTORIA QUINONES BARR PLLC',
  address: '1312 14th St, Ste 206, Plano, TX 75074',
  bar: '24105960',
  phone: '(214) 799-3961',
  fax: '(214) 614-4928',
  email: 'attorney@victoriabarrlaw.com',
};

// ── Letterhead block (text representation of firm letterhead) ─────────────
const LETTERHEAD = `${ATTORNEY.firm}
${ATTORNEY.name}, Attorney at Law
Texas Bar No. ${ATTORNEY.bar}
${ATTORNEY.address}
Phone: ${ATTORNEY.phone} | Fax: ${ATTORNEY.fax}
${ATTORNEY.email}
${'─'.repeat(72)}`;

// ── Static embedded templates ────────────────────────────────────────────────
// Templates extracted directly from firm documents; variables in [BRACKETS].
const STATIC_TEMPLATES: Record<string, (vars: Record<string, string>) => string> = {

  motion_withdraw_counsel: (v) => `CAUSE NO. ${v.causeNo || '_________________'}

STATE OF TEXAS                             §
                                           §
v.                                         §    ${v.court || '[COURT]'}
                                           §
${v.defendant || '____________________'}   §    ${v.county || '[COUNTY]'} COUNTY, TEXAS

              MOTION TO WITHDRAW AS ATTORNEY OF RECORD

ANNA VICTORIA BARR, Defendant's attorney of record in the above-styled and numbered cause, files this Motion to withdraw and in support shows the following:

     1.   Movant is the attorney of record for ${v.defendant || '____________________________'}.

     2.   Attorney was retained on ________________.

     3.   Defendant agrees to the withdrawal as evidenced by his signature.

     4.   Defendant has been delivered a copy of this Motion, and has been notified in writing of the right to object to this Motion. The last known address for Defendant is _____________________________. The last known telephone number for Defendant is _______________. The last known email for Defendant is ____________________.

     5.   Good cause to withdraw exists and in support Movant shows as follows:

     6.   Defendant has failed substantially to fulfill an obligation to Movant regarding Movant's services, including an obligation to pay Movant's fee as agreed, and has been given reasonable warning that the Movant will withdraw unless the obligation is fulfilled.

     7.   The withdrawal is not sought for delay, but that Defendant may be represented by counsel of his choice.

     8.   Continued representation by counsel is prejudicial to the Defendant because he will not receive effective assistance of counsel and a fair trial in this case for the reasons stated above.

     9.   Withdrawal of counsel will not adversely affect or delay the interest of justice.

     10.  The pending settings and deadlines in this case are as follows:
          Next Appearance: ______________________

MOVANT PRAYS this Court grant all relief requested in this Motion or, in the alternative, this Court set this Motion for a hearing and at the conclusion of the hearing the Court grant all requested relief.

                                            Respectfully submitted,

                                            ${ATTORNEY.firm}
                                            1312 14th Street, Suite 206, Plano, TX 75074


                                            /s/ Anna Victoria Barr
                                            ANNA VICTORIA BARR
                                            Attorney for Defendant
                                            Bar No. ${ATTORNEY.bar}
                                            Office Phone: ${ATTORNEY.phone}
                                            Fax: (214) 310-0540
                                            Email: office@victoriabarrlaw.com


I, _______________________, AGREE TO THIS WITHDRAWAL OF ATTORNEY

_____________________________
SIGNATURE

DATE: _____________________________


                              CERTIFICATE OF SERVICE

I certify that a true and correct copy of the above document was served on the ${v.county || '[COUNTY]'} County District Attorney's office, through the electronic filing manager on _________________.

/s/ Anna Victoria Barr
ANNA VICTORIA BARR
Attorney for Defendant


                         CERTIFICATE OF SERVICE TO DEFENDANT

I certify that a true copy of this Motion has been electronically delivered to Defendant at his last known email ________________________.

/s/ Anna Victoria Barr
ANNA VICTORIA BARR
Attorney`,

  nd_checklist_dwi: (_v) => `FORM 12A-1 — QUICK REFERENCE CHECKLIST: NONDISCLOSURE LAW FOR DWIs
${'─'.repeat(72)}

A DWI conviction IS ELIGIBLE for a nondisclosure order IF ALL of the following apply:

  1. It is a true first offense (client has never been convicted or placed on deferred
     adjudication for any offense, other than a fine-only traffic offense).

  2. The client is NOT convicted of an enhanced DWI under Tex. Penal Code §49.04(d)
     (i.e., BAC of .15 or higher).

  3. The client successfully completed probation OR a term of confinement.

  4. The client has paid all fines, court costs, and restitution.

  5. The DWI did NOT result in an accident involving another person, including a
     passenger in the client's car.

  6. The appropriate waiting period has elapsed without any new offenses (other than
     a fine-only traffic offense).

WAITING PERIODS:

  Successful Completion of Probation:
    • 2 years — if client had a DLD (deep-lung device/interlock) installed as a
      condition of probation; OR
    • 5 years — if there was no DLD.

  Jail Sentence (initial sentence OR probation revocation):
    • 3 years — if client had a DLD installed as a condition of the sentence; OR
    • 5 years — if there was no DLD.

─────────────────────────────────────────────────────────────────────────
A DWI conviction is NOT ELIGIBLE for nondisclosure if:

  1. The client is convicted of an enhanced DWI (.15 or higher BAC).
  2. The client is convicted of a DWI 2nd or more.
  3. The client is convicted of Boating While Intoxicated, Flying While Intoxicated,
     or Assembling/Operating an Amusement Park Ride While Intoxicated.
  4. The DWI involved an accident involving another person, including a passenger.
  5. The client failed to comply with the applicable waiting period.

─────────────────────────────────────────────────────────────────────────
FORM REFERENCE:
  • Form 12A-2 — Verified Petition for Nondisclosure (Successful Probation)
  • Form 12A-4 — Verified Petition for Nondisclosure (Confinement/Unsuccessful CS)
  • Form 12A-5 — Order of Nondisclosure (Confinement/Unsuccessful CS)`,

  nd_petition_probation: (v) => `NO. ${v.causeNo || '__________________________'}

STATE OF TEXAS                 §     IN THE ${v.court || '________'} COURT
                               §
vs.                            §     OF
                               §
${v.defendant || '_________________'} §     ${v.county || '_____'} COUNTY, TEXAS


                        VERIFIED PETITION FOR NONDISCLOSURE
                              (SUCCESSFUL PROBATION — DWI)
                             [FORM 12A-2 / Gov't Code § 411.0731]

TO THE HONORABLE JUDGE OF SAID COURT:

${v.defendant || '___________________'}, Petitioner, moves this Court for an Order of Nondisclosure under Section 411.0731 of the Texas Government Code and would show the Court as follows:

Petitioner's information:
NAME:                    ${v.defendant || '___________________'}
SEX:                     _______________
RACE:                    _______________
DATE OF BIRTH:           _______________
DRIVER'S LICENSE NUMBER: Texas _______________
SOCIAL SECURITY NUMBER:  _______________

Offense that is the subject of this Petition:
OFFENSE:                 Driving While Intoxicated under .15
DATE OF OFFENSE:         on or about _______________
DATE OF ARREST:          on or about _______________
COUNTY WHERE ARRESTED:   ${v.county || '____________'}
ARRESTING AGENCY:        _______________
CASE NUMBER:             ${v.causeNo || '_______________'}
COURT:                   ${v.court || '_______________'}

Petitioner is eligible for the requested Order because the offense for which Petitioner was convicted was a misdemeanor under Tex. Penal Code §49.04, but not an offense punishable under subsection (d) of that section.

NOTE: SELECT ONE OF THE FOLLOWING TWO PARAGRAPHS:

[ ] Petitioner is eligible for the requested Order because at least two years have passed since
Petitioner was discharged from community supervision on ____________________, during which
Petitioner successfully complied with a term of community supervision requiring his/her vehicle
to be equipped with an ignition interlock device for a period of at least six months.
(See Exhibits ____).

                                        —OR—

[ ] Petitioner is eligible for the requested Order because at least five years have passed since
Petitioner was discharged from community supervision on __________________. (See Exhibit ____).

During the period described above, Petitioner has not been convicted of or placed on deferred adjudication community supervision for any offense other than an offense under the Transportation Code punishable by fine only.

Petitioner has not been placed on deferred adjudication community supervision for or has not been previously convicted or placed on any other deferred adjudication for:
     a. an offense requiring registration as a sex offender under Chapter 62, Code of Criminal Procedure;
     b. an offense under Section 20.04, Penal Code, regardless of whether the offense is a reportable conviction or adjudication for purposes of Chapter 62, Code of Criminal Procedure;
     c. an offense under Section 19.02, 19.03, 22.04, 22.041, 25.07, or 42.072, Penal Code; or
     d. any other offense involving family violence, as defined by Section 71.004, Family Code.

Petitioner would also show that the issuance of an Order of Nondisclosure is in the best interest of justice because: __________________________________.

Petitioner prays that the Court will set this matter for a hearing, if requested by the state, and issue an Order of Nondisclosure.

                                            Respectfully submitted,

                                            ${ATTORNEY.firm}


                                            /s/ ${ATTORNEY.name}
                                            ${ATTORNEY.name}
                                            Texas Bar No. ${ATTORNEY.bar}
                                            ${ATTORNEY.address}
                                            Phone: ${ATTORNEY.phone}
                                            Fax: (214) 310-0540
                                            office@victoriabarrlaw.com


                              CERTIFICATE OF SERVICE

This is to certify that on _________, a true and correct copy of the above and foregoing document was served on the District Attorney's Office, ${v.county || '_______'} County, by e-service delivery through the Texas E-File system to [Insert name of person served].

________________________________
${ATTORNEY.name}


${'─'.repeat(72)}

NO. ${v.causeNo || '__________________________'}

STATE OF TEXAS                 §     IN THE ${v.court || '________'} COURT
                               §
vs.                            §     OF
                               §
${v.defendant || '_________________'} §     ${v.county || '_______'} COUNTY, TEXAS


                              ORDER FOR A SETTING

On _________________, the Petitioner filed a Petition for Nondisclosure. The Court finds that the party is entitled to a hearing on this matter, and it is THEREFORE ORDERED that a hearing on this motion is set for __________, at _____.

Signed on ________.

___________________________
JUDGE PRESIDING`,

  nd_petition_confinement: (v) => `NO. ${v.causeNo || '__________________________'}

STATE OF TEXAS                 §     IN THE ${v.court || '________'} COURT
                               §
vs.                            §     OF
                               §
${v.defendant || '_________________'} §     ${v.county || '____________'} COUNTY, TEXAS


                        VERIFIED PETITION FOR NONDISCLOSURE
                     (CONFINEMENT OR UNSUCCESSFUL PROBATION — DWI)
                             [FORM 12A-4 / Gov't Code § 411.0736]

TO THE HONORABLE JUDGE OF SAID COURT:

${v.defendant || '___________________'}, Petitioner, moves this Court for an Order of Nondisclosure under Section 411.0736 of the Texas Government Code and would show the Court as follows:

Petitioner's information:
NAME:                    ${v.defendant || '___________________'}
SEX:                     _______________
RACE:                    _______________
DATE OF BIRTH:           _______________
DRIVER'S LICENSE NUMBER: Texas _______________
SOCIAL SECURITY NUMBER:  _______________

Offense that is the subject of this Petition:
OFFENSE:                 Driving While Intoxicated under .15
DATE OF OFFENSE:         on or about _______________
DATE OF ARREST:          on or about _______________
COUNTY WHERE ARRESTED:   ${v.county || '____________'}
ARRESTING AGENCY:        _______________
CASE NUMBER:             ${v.causeNo || '_______________'}
COURT:                   ${v.court || '_______________'}
TRN:                     ______________

Petitioner is eligible for the requested Order because the offense for which Petitioner was convicted was a misdemeanor under Tex. Penal Code §49.04, but not an offense punishable under subsection (d) of that section.

NOTE: SELECT ONE OF THE FOLLOWING TWO PARAGRAPHS:

[ ] Petitioner is eligible for the requested Order because at least three years have passed since
Petitioner completed his/her term of confinement under the sentence on ____________________
(or was unsuccessfully discharged from probation) and Petitioner successfully complied with a
term of his/her sentence requiring his/her vehicle to be equipped with an ignition interlock device
for a period of at least six months. (See Exhibits ____).

                                        —OR—

[ ] Petitioner is eligible for the requested Order because at least five years have passed since
Petitioner completed his sentence of confinement (or was unsuccessfully discharged from
probation) on __________________. (See Exhibit ____).

During the period described above, Petitioner has not been convicted of or placed on deferred adjudication community supervision for any offense other than an offense under the Transportation Code punishable by fine only.

Petitioner has not been placed on deferred adjudication community supervision for or has not been previously convicted or placed on any other deferred adjudication for:
     a. an offense requiring registration as a sex offender under Chapter 62, Code of Criminal Procedure;
     b. an offense under Section 20.04, Penal Code, regardless of whether the offense is a reportable conviction or adjudication for purposes of Chapter 62, Code of Criminal Procedure;
     c. an offense under Section 19.02, 19.03, 22.04, 22.041, 25.07, or 42.072, Penal Code; or
     d. any other offense involving family violence, as defined by Section 71.004, Family Code.

Petitioner would also show that the issuance of such an Order of Nondisclosure is in the best interest of justice because: _________________________________________________.

Petitioner prays that the Court will set this matter for a hearing, if requested by the state, and issue an Order of Nondisclosure.

                                            Respectfully submitted,

                                            ${ATTORNEY.firm}


                                            /s/ ${ATTORNEY.name}
                                            ${ATTORNEY.name}
                                            Texas Bar No. ${ATTORNEY.bar}
                                            ${ATTORNEY.address}
                                            Phone: ${ATTORNEY.phone}
                                            Fax: (214) 310-0540
                                            office@victoriabarrlaw.com


                              CERTIFICATE OF SERVICE

This is to certify that on _______, a true and correct copy of the above and foregoing document was served on the District Attorney's Office, ${v.county || '______'} County, by e-service delivery through the Texas E-File system to [Insert name of person served].

________________________________
${ATTORNEY.name}


${'─'.repeat(72)}

NO. ${v.causeNo || '__________________________'}

STATE OF TEXAS                 §     IN THE ${v.court || '________'} COURT
                               §
vs.                            §     OF
                               §
${v.defendant || '_________________'} §     ${v.county || '____________'} COUNTY, TEXAS


                              ORDER FOR A SETTING

On ____________________, the Petitioner filed a Petition for Nondisclosure. The Court finds that the party is entitled to a hearing on this matter, and it is THEREFORE ORDERED that a hearing on this motion is set for _______________, at ______.

Signed on ______.

___________________________
JUDGE PRESIDING`,

  nd_order_confinement: (v) => `NO. ${v.causeNo || '__________________________'}

STATE OF TEXAS                 §     IN THE ${v.court || '________'} COURT
                               §
vs.                            §     OF
                               §
${v.defendant || '_________________'} §     ${v.county || '________'} COUNTY, TEXAS


                              ORDER OF NONDISCLOSURE
                     (CONFINEMENT/UNSUCCESSFUL CS CASES — DWI)
                                    [FORM 12A-5]

On __________, the Court heard the foregoing Petition for Nondisclosure and finds that it should be GRANTED and provides the following information to allow the appropriate agencies to comply with this Order:

Petitioner's information:
NAME:                    ${v.defendant || '___________________'}
SEX:                     _______________
RACE:                    _______________
DATE OF BIRTH:           _______________
DRIVER'S LICENSE NUMBER: Texas _______________
SOCIAL SECURITY NUMBER:  _______________

Offense that is the subject of this Petition:
OFFENSE:                 Driving While Intoxicated under .15
DATE OF OFFENSE:         on or about _______________
DATE OF ARREST:          on or about _______________
COUNTY WHERE ARRESTED:   ${v.county || '____________'}
ARRESTING AGENCY:        _______________
CASE NUMBER:             ${v.causeNo || '_______________'}
COURT:                   ${v.court || '_______________'}
TRN:                     ______________

The Court further finds:

Petitioner is eligible for the requested Order because the offense for which Petitioner was convicted was Driving While Intoxicated under Texas Penal Code §49.04, which is a misdemeanor, but not a misdemeanor under Texas Penal Code Chapters 20, 21, 22, 25, 42, or 46, or an offense under §49.04(d).
Petitioner has successfully complied with the applicable waiting period.
Petitioner has not been placed on deferred adjudication community supervision for or been previously convicted or placed on any other deferred adjudication that would render Petitioner ineligible for this nondisclosure.
Petitioner successfully completed his/her sentence.

IT IS THEREFORE ORDERED that not later than 15 days following the date of this Order, the Clerk of this Court shall send a copy of this Order by certified mail, return receipt requested, to the Crime Records Service of the Texas Department of Public Safety, at the following address:

     Texas Department of Public Safety
     Crime Records Division – MSC 0234
     Post Office Box 4143
     Austin, Texas 78765-4143

IT IS FURTHER ORDERED that not later than 10 days following its receipt of this Order, the Department of Public Safety shall seal any criminal history record information maintained by the department that is the subject of the order.

IT IS FURTHER ORDERED that not later than 30 business days following its receipt of this Order, the Department of Public Safety shall send a copy of this order by mail or electronic means to all:

(1) law enforcement agencies, jails or other detention facilities, magistrates, courts, prosecuting attorneys, correctional facilities, central state depositories of criminal records, and other officials or agencies or other entities of this state or of any political subdivision of this state, including but not limited to the following:
     ___________ Police Department
     ___________ County Clerk
     ${v.county || '___________'} County District Attorney
     ${v.county || '___________'} County Sheriff
     ${v.county || '___________'} County Community Supervision (probation)
     Federal Bureau of Investigation & FBI Criminal Justice Information Services Division
     1000 Custer Hollow Road
     Clarksburg, West Virginia 26306

(2) central federal depositories of criminal records that there is reason to believe have criminal history record information that is the subject of the order; and

(3) private entities that purchase criminal history record information from the Department of Public Safety.

No later than 30 business days following its receipt of this Order, the Department of Public Safety is further ORDERED to send a copy of the order by mail or secure electronic mail or facsimile transmission to all law enforcement agencies, jails or other detention facilities, magistrates, courts, prosecuting attorneys, correctional facilities, central state depositories of criminal records, and other officials or agencies or other entities of this state or of any political subdivision of this state, and to all central federal depositories of criminal records that there is reason to believe have criminal history record information that is the subject of the order.

IT IS FURTHER ORDERED that this document is confidential, and that this document is not public information as that term is defined under the Texas Public Information Act, and shall not be disseminated pursuant to a request made under the Public Information Act. The court does not prohibit disclosure of this offense to other criminal justice agencies, to the Petitioner himself, or to other entities as specifically provided for by statute.

IT IS FURTHER ORDERED that the Agencies listed in this ORDER shall seal the arrest record of Petitioner within 30 days of their receipt of this ORDER pursuant to Texas Government Code § 411.075.

IT IS FURTHER ORDERED that not later than 30 days following the date this Order is signed, the Clerk of this Court shall send a conformed copy of this Order to the attorney for Petitioner.

Signed on __________,

_____________________
JUDGE PRESIDING`,

  engagement_expunction: (v) => `VICTORIA QUINONES BARR PLLC d/b/a VICTORIA BARR LAW, PLLC
${ATTORNEY.address}
Phone: ${ATTORNEY.phone} | Fax: (214) 310-0540
office@victoriabarrlaw.com | www.victoriabarrlaw.com
${'─'.repeat(72)}

              EXPUNCTION & NONDISCLOSURE LEGAL SERVICES AGREEMENT
                    Victoria Quinones Barr, PLLC d/b/a Victoria Barr Law, PLLC

Client and Attorney enter into this Legal Services Agreement (the "Agreement") on _______________________. The parties to this Agreement are Anna Victoria Quinones Barr, doing business as Victoria Barr Law, PLLC ("Attorney"), and ${v.defendant || '_____________________________________________ '} ("Client"). Attorney agrees to represent Client in the matter of a Petition for Expunction or Petition for Order of Nondisclosure in _________________________, Texas. This Agreement establishes the terms and conditions under which Attorney provides legal services to Client.

I. SCOPE OF REPRESENTATION
─────────────────────────────────────────────────────────────────────────
Attorney provides legal services including: counseling and advising Client regarding eligibility for expunction or nondisclosure; investigating facts and applicable records; drafting the Petition; filing the Petition with the appropriate court; serving all statutorily required respondent agencies; and representing Client at the final hearing or compliance docket.

Attorney retains sole professional authority over the means of representation, including strategy, drafting priorities, and courtroom tactics. Client retains authority over the objectives of representation, including whether to proceed with the filing. Attorney may refuse to take any action Attorney considers imprudent, unethical, or contrary to the Texas Disciplinary Rules of Professional Conduct ("TDRPC") or The Texas Lawyer's Creed, regardless of Client's instruction.

Client acknowledges that Attorney cannot guarantee any particular outcome. The presiding judge holds sole discretion to grant or deny an Order of Nondisclosure, and statutory entities may contest Expunction eligibility. Attorney provides diligent representation within the bounds of the law and the TDRPC.

A. Immigration Consequences Analysis Add-On — Limited Scope
─────────────────────────────────────────────────────────────────────────
This add-on applies ONLY when Client seeks to retain Victoria Barr Law, PLLC to provide a formal, written Immigration Consequences Memorandum detailing how an expunction or nondisclosure impacts Client's federal immigration status.

________ Client initialing here confirms Client retains Victoria Barr Law, PLLC under this add-on for the written Immigration Consequences Memorandum.

Under this add-on, Attorney analyzes the specific federal immigration impact of the state-court record clearing process. Client acknowledges that federal immigration authorities (including the Department of Homeland Security) routinely ignore Texas expunctions and nondisclosures. Attorney prepares a written informational letter summarizing these consequences in plain language. Attorney does not file affirmative immigration applications under this agreement.

II. FEE-EARNING BENCHMARK STRUCTURE
─────────────────────────────────────────────────────────────────────────
Attorney and Client agree that fees vest as fully earned and the sole property of Attorney upon completion of the following benchmarks. Each benchmark represents actual professional work performed or a professional obligation incurred. Fees vest as non-refundable only as Attorney completes each benchmark. This structure complies with TDRPC Rule 1.04 and Texas State Bar Ethics Opinion 611 (2011).

First Benchmark (1/3)
─────────────────────────────────────────────────────────────────────────
Attorney earns one-third of the flat fee upon drafting and filing the Petition for Expunction or Petition for Order of Nondisclosure with the appropriate court. This action establishes Attorney as Counsel of Record and initiates the civil proceeding, imposing immediate, judicially-supervised professional obligations on Attorney. If representation ends before Attorney completes this benchmark, Attorney bills Client at $475.00 per hour for time spent.

Second Benchmark (1/3)
─────────────────────────────────────────────────────────────────────────
Attorney earns an additional one-third of the flat fee upon serving the filed Petition and notices of hearing on all required statutory respondent agencies (e.g., Department of Public Safety, District Attorney, local law enforcement). Identifying, locating, and properly serving these entities constitutes core legal work necessary to bind the agencies to the final order. If representation ends before Attorney completes this benchmark, Attorney bills Client at $475.00 per hour for time spent.

Third Benchmark (1/3)
─────────────────────────────────────────────────────────────────────────
Attorney earns the final one-third of the flat fee upon representing Client at the final hearing or upon securing an agreed Order signed by the presiding judge, whichever occurs first. If representation ends before Attorney completes this benchmark, Attorney bills Client at $475.00 per hour for time spent.

Upon completing each benchmark, Attorney transfers the earned portion from Client's trust funds to Attorney's operating account immediately. These amounts represent fees Attorney earned through work performed or professional obligations incurred.

III. FEES AND PAYMENT TERMS
─────────────────────────────────────────────────────────────────────────
Client agrees to pay a total Flat Fee of $____________________________ for representation. Client agrees to pay an initial payment of $____________________________ today.

A. Immigration Consequences Analysis Add-On Fee
─────────────────────────────────────────────────────────────────────────
If Client initialed the add-on in Section I, Client agrees to pay an additional Flat Fee of $____________________________ for the written Immigration Consequences Analysis.

B. Exclusions from All Fees
─────────────────────────────────────────────────────────────────────────
Attorney excludes the following costs from the flat fee: filing fees; background check fees; fingerprinting costs; court reporter transcripts; travel expenses; and postage for serving respondent agencies. Attorney requires Client to pay the initial court filing fee (typically ranging from $300 to $400 depending on the county and number of agencies) before Attorney files the Petition. Attorney charges expenses of $500.00 or less automatically to the account on file and provides Client written notice within three (3) business days.

C. Payment Schedule and Default
─────────────────────────────────────────────────────────────────────────
Client owes all legal fees in full at the time Client signs this Agreement. At Attorney's sole discretion, Attorney permits Client to make installment payments as a courtesy. Client understands that failure to maintain timely payments accelerates the entire remaining balance and constitutes grounds for Attorney to withdraw.

Attorney assesses a $75.00 late fee for each payment Client fails to submit on its due date. Attorney assesses a $150.00 NSF fee for any returned check and a $35.00 fee for any declined credit card charge. Client must not pay legal fees using funds derived from illegal activities.

┌─────┬───────────────────────────┬──────────────────────────┐
│ No. │        Amount Due         │         Due Date          │
├─────┼───────────────────────────┼──────────────────────────┤
│  1  │  $                        │                           │
│  2  │  $                        │                           │
│  3  │  $                        │                           │
│  4  │  $                        │                           │
│  5  │  $                        │                           │
└─────┴───────────────────────────┴──────────────────────────┘

IV. IMMIGRATION CONSEQUENCES — FEDERAL TREATMENT OF EXPUNCTIONS
─────────────────────────────────────────────────────────────────────────
Victoria Barr Law, PLLC practices both criminal defense and immigration law. Attorney specifically advises Client that federal immigration law, under the Immigration and Nationality Act (INA), does not recognize Texas expunctions or orders of nondisclosure for most purposes. If Client is not a United States citizen, federal agencies may still treat an expunged or sealed record as a conviction or admission of criminal conduct.

Client understands that obtaining an expunction or nondisclosure under Texas law does not erase the record for deportation, inadmissibility, or naturalization proceedings. Attorney advises Client to retain copies of all criminal court records before pursuing an expunction, as federal authorities often require these documents even after the State of Texas destroys them.

V. CLIENT CONDUCT AND COMMUNICATION STANDARDS
─────────────────────────────────────────────────────────────────────────
Client agrees to communicate with Attorney and all firm staff in a professional and respectful manner at all times. Client understands that threatening, harassing, intimidating, or abusive conduct directed at Attorney or firm staff constitutes immediate grounds for termination of this Agreement.

Attorney maintains regular business hours of Monday through Friday, 9:00 a.m. to 5:30 p.m. CST. Attorney makes reasonable efforts to respond to Client communications within two (2) business days. Client agrees to use a single designated method of communication per inquiry.

Client must maintain current contact information on file with Attorney at all times. If Client remains unreachable for ten (10) or more consecutive business days despite Attorney's documented attempts to contact Client, Attorney treats Client's non-communication as conduct making representation unreasonably difficult and initiates withdrawal.

VI. LIMITATIONS ON REPRESENTATION
─────────────────────────────────────────────────────────────────────────
The fees in this Agreement cover only the expunction or nondisclosure services described in Section I. This Agreement expressly excludes the following matters, which require a separate written fee agreement:

     •  Representation in any active or pending criminal prosecution, trial, or appeal.
     •  Administrative License Revocation (ALR) hearings before the Texas Department of Public Safety.
     •  Representation for probation revocations or motions to adjudicate guilt.
     •  Filing affirmative applications with United States Citizenship and Immigration Services (USCIS) or representation in Immigration Court.

VII. TERMINATION AND DISPUTE RESOLUTION
─────────────────────────────────────────────────────────────────────────
Client may terminate this Agreement at any time upon written notice to Attorney. Upon termination, Client remains responsible for fees Attorney earned through any completed benchmarks. If Attorney completes no benchmark, Client owes fees at $475.00 per hour for time spent.

The parties submit any dispute arising exclusively from Attorney's fees, charges, billing, or payment obligations to a three-step resolution process: (1) thirty (30) days of good-faith direct negotiation; (2) non-binding mediation in Collin County, Texas, or submission to the State Bar of Texas Fee Dispute Resolution Program; and (3) final and binding arbitration in Collin County, Texas, administered by the American Arbitration Association (AAA).

VIII. CLIENT ACKNOWLEDGMENT AND AUTHORIZATION
─────────────────────────────────────────────────────────────────────────
I confirm that I read, understand, and agree to all terms of this Agreement. I specifically acknowledge the benchmark fee structure, the exclusion of criminal trial representation, and the strict communication standards. I further acknowledge Attorney advised me that federal immigration authorities do not recognize Texas expunctions or nondisclosures.


Client Name:      ________________________________

Client Signature: ________________________________

Date:             ________________________________


                                            ________________________________
                                            Anna Victoria Quinones Barr
                                            ${ATTORNEY.firm}
                                            Texas Bar No. ${ATTORNEY.bar}
                                            ${ATTORNEY.phone} | Fax: (214) 310-0540
                                            office@victoriabarrlaw.com

________  INITIALS`,

  appearance_39_14: (v) => `${LETTERHEAD}

NO. ${v.causeNo || '[CAUSE NO.]'}

STATE OF TEXAS vs. ${v.defendant || '[DEFENDANT NAME]'}          IN THE ${v.court || '[COURT]'}
                                                                ${v.county || '[COUNTY]'} COUNTY, TEXAS

                    APPEARANCE OF COUNSEL AND ART. 39.14 REQUEST

TO THE HONORABLE JUDGE OF SAID COURT:

Now comes ${ATTORNEY.name} and hereby files this appearance as attorney of record for ${v.defendant || '[DEFENDANT NAME]'}, Defendant. Defendant retained ${ATTORNEY.name}, and he/she consents to appearance as attorney of record in this cause.

Defendant requests a speedy trial in this cause. Please notify undersigned Counsel of all settings and filings in this cause.

In addition to this attorney's appearance, this document shall also serve as a formal request upon the prosecuting attorney to comply with Art. 39.14 of the Texas Code of Criminal Procedure to produce and permit the inspection and/or the electronic duplication, copying, and photographing, by and on behalf of the defendant the following:

     a.  Any offense reports of any law enforcement officer or officers or investigators involved in the investigation, arrest, and/or detainment of the defendant herein;

     b.  Any documents, papers, written or recorded statements of the defendant;

     c.  Any documents, papers, written or recorded statements of any witness which the prosecuting attorney may call as a witness herein;

     d.  Any photographs, audio or video recordings of the defendant, witnesses, victims, or alleged crime scenes;

     e.  Any books, accounts, ledgers, letters, photographs, or other tangible objects involved in the investigation and/or prosecution of this offense;

     f.  Any tangible property of any type seized during any arrest, search, detainment of the defendant herein;

     g.  Any evidence which is exculpatory, impeachment or mitigating document, item or information in the possession, custody, or control of the State, any law enforcement agency, or any State agency that tends to negate the guilt of the defendant or would tend to reduce the punishment for the offense charged;

     h.  The names, current addresses, current telephone numbers, of any witness which may be called by the prosecution in this cause pursuant to Rules 702, 703, and 705 of the Texas Rules of Evidence;

     i.  All reports and writings produced by any and all experts with whom the State communicated in regards to this cause, as well as any data relied upon by such experts;

     j.  The criminal history of each and every witness the prosecution may call as a witness in this cause, as well as disciplinary history, including but not limited to suspensions or termination of any agents of the State;

     k.  Any information relevant under Ex Parte Bowman, 483 S.W.3d 726 (Tex. App.–Houston [1st Dist.] 2016), as it may apply to any State's witness.

This request does not include the work product of counsel for the State in the case and their investigators employed by the prosecuting attorney for the State, nor their notes, nor written communications, other than technical or scientific opinions/conclusions, between the State and an agent, representative, or employee of the State that reference evidence material to any matter involved in this cause. However, it does extend to all items requested herein and that are in the possession, custody, or control of the State, any agent of the State, or any person under contract with the State or which reasonably may be obtained by the State. The State may provide electronic duplicates of any documents or other information.

This request extends to any time before, during or after trial that the State, its agents, servants, and/or employees discover any additional document, item, or information required to be disclosed pursuant to Article 39.14 of the Texas Code of Criminal Procedure under Subsection (h) requiring the prosecuting attorney for the State to promptly disclose the existence of the document, item or information to the defendant, his attorney of record, and the court.

Compliance with said request is necessary for due process and adequate preparation for a speedy trial. Additionally, the defendant, by and through his attorney of record hereby requests that the State electronically record or otherwise document any document, item, or other information provided pursuant hereto, setting forth each document, item, or other information and the date and time same was provided to defendant's attorney of record.

This request is made pursuant to the requirements of Article 39.14 of the Texas Rules of Criminal Procedure and the Attorney for Defendant requests that the prosecuting attorney for the State comply with these requests within 30 days, or file a formal motion to extend the time and request a formal hearing for the reasons for noncompliance and/or extending the time for compliance.

                                            Respectfully submitted,

                                            ${ATTORNEY.firm}


                                            _________________________________
                                            ${ATTORNEY.name}
                                            Texas Bar No. ${ATTORNEY.bar}
                                            ${ATTORNEY.address}
                                            Phone: ${ATTORNEY.phone}
                                            Fax: ${ATTORNEY.fax}
                                            ${ATTORNEY.email}

                              CERTIFICATE OF SERVICE

This is to certify that on ____________, 20___, a true and correct copy of the above and foregoing document was served on the District Attorney's Office, ${v.county || '[COUNTY]'} County, Texas, by hand delivery / electronic filing manager.


                                            _________________________________
                                            ${ATTORNEY.name}`,
};

// ── Criminal forms ────────────────────────────────────────────────────────────
const CRIM_FORMS = [
  { value: 'motion_suppress', label: 'Motion to Suppress Evidence', category: 'Motions' },
  { value: 'motion_dismiss_speedy', label: 'Motion to Dismiss – Speedy Trial', category: 'Motions' },
  { value: 'motion_dismiss_general', label: 'Motion to Dismiss (General)', category: 'Motions' },
  { value: 'motion_continuance', label: 'Motion for Continuance', category: 'Motions' },
  { value: 'motion_discovery_criminal_records', label: 'Motion for Discovery – Criminal Records', category: 'Motions' },
  { value: 'motion_discovery_general', label: 'Motion for Discovery (General)', category: 'Motions' },
  { value: 'motion_brady', label: 'Motion to Produce Exculpatory Evidence (Brady)', category: 'Motions' },
  { value: 'motion_bond_reduction', label: 'Motion to Reduce Bond', category: 'Motions' },
  { value: 'motion_appoint_investigator', label: 'Motion for Appointment of Investigator', category: 'Motions' },
  { value: 'motion_new_trial', label: 'Motion for New Trial', category: 'Motions' },
  { value: 'motion_withdraw_counsel', label: 'Motion to Withdraw as Counsel', category: 'Motions' },
  { value: 'motion_substitute_counsel', label: 'Motion to Substitute Counsel', category: 'Motions' },
  { value: 'motion_change_name', label: 'Motion Changing Name of Defendant', category: 'Motions' },
  { value: 'motion_election_punishment', label: 'Motion for Election as to Punishment', category: 'Motions' },
  { value: 'habeas_corpus', label: 'Petition for Writ of Habeas Corpus', category: 'Motions' },
  { value: 'motion_capital_jury_list', label: 'Motion for Supplemental Capital Jury List', category: 'Motions' },
  { value: 'appearance_39_14', label: 'Appearance of Counsel & Art. 39.14 Request', category: 'Appearances & Discovery' },
  { value: 'rep_letter_court', label: 'Request for Entry as Attorney of Record (Court)', category: 'Appearances & Discovery' },
  { value: 'rep_letter_agency', label: 'Request for Entry as Attorney of Record (Agency)', category: 'Appearances & Discovery' },
  { value: 'open_records', label: 'Open Records Request', category: 'Appearances & Discovery' },
  { value: 'subpoena_letter', label: 'Subpoena Cover Letter / Witness List', category: 'Appearances & Discovery' },
  { value: 'waiver_jury', label: 'Waiver of Jury', category: 'Waivers & Admonishments' },
  { value: 'waiver_discovery_rights', label: 'Acknowledgement of Discovery Rights (Art. 39.14)', category: 'Waivers & Admonishments' },
  { value: 'admon_immigration', label: 'Acknowledgement of Immigration Consequences of Plea', category: 'Waivers & Admonishments' },
  { value: 'admon_collateral', label: 'Admonition on Collateral Consequences of Plea', category: 'Waivers & Admonishments' },
  { value: 'admon_dl_suspension', label: 'Admonition – Driver\'s License Suspension', category: 'Waivers & Admonishments' },
  { value: 'admon_family_violence', label: 'Admonition – Family Violence Conviction', category: 'Waivers & Admonishments' },
  { value: 'admon_community_supervision', label: 'Admonition – Community Supervision Consequences', category: 'Waivers & Admonishments' },
  { value: 'plea_agreement', label: 'Plea Agreement Letter', category: 'Plea Documents' },
  { value: 'plea_worksheet', label: 'Plea Worksheet / Summary of Judgment', category: 'Plea Documents' },
  { value: 'motion_election_punishment_plea', label: 'Defense Motion for Election as to Punishment', category: 'Plea Documents' },
  { value: 'intake_general', label: 'General Client Intake Questionnaire (English)', category: 'Client Intake & Engagement' },
  { value: 'intake_general_spanish', label: 'General Client Intake Questionnaire (Bilingual)', category: 'Client Intake & Engagement' },
  { value: 'intake_dwi', label: 'DWI Case Intake Worksheet', category: 'Client Intake & Engagement' },
  { value: 'intake_expunction', label: 'Expunction Eligibility Interview Sheet', category: 'Client Intake & Engagement' },
  { value: 'engagement_expunction', label: 'Legal Services Agreement – Expunction & Nondisclosure', category: 'Client Intake & Engagement' },
  { value: 'engagement_terms', label: 'Terms and Conditions of Legal Representation', category: 'Client Intake & Engagement' },
  { value: 'auth_release_info', label: 'Client Authorization to Release Information', category: 'Client Intake & Engagement' },
  { value: 'auth_medical_records', label: 'Authorization for Release of Medical Records', category: 'Client Intake & Engagement' },
  { value: 'auth_hipaa', label: 'HIPAA Authorization', category: 'Client Intake & Engagement' },
  { value: 'client_letter_plea', label: 'Client Letter – Plea Offer', category: 'Client Letters' },
  { value: 'client_letter_hearing', label: 'Client Letter – Hearing Notice', category: 'Client Letters' },
  { value: 'client_letter_strategy', label: 'Client Letter – Defense Strategy', category: 'Client Letters' },
  { value: 'client_letter_probation', label: 'Client Letter – Probation Survival Guide', category: 'Client Letters' },
  { value: 'expunction_petition', label: 'Petition for Expunction – Chapter 55', category: 'Post-Conviction' },
  { value: 'nd_checklist_dwi', label: 'DWI Nondisclosure Eligibility Checklist (12A-1)', category: 'Post-Conviction' },
  { value: 'nd_petition_probation', label: 'Verified Petition for Nondisclosure – Successful Probation (12A-2)', category: 'Post-Conviction' },
  { value: 'nd_petition_confinement', label: 'Verified Petition for Nondisclosure – Confinement/Unsuccessful CS (12A-4)', category: 'Post-Conviction' },
  { value: 'nd_order_confinement', label: 'Order of Nondisclosure – Confinement/Unsuccessful CS (12A-5)', category: 'Post-Conviction' },
  { value: 'motion_release_cash_bond', label: 'Motion to Release Funds – Cash Bail Bond', category: 'Post-Conviction' },
  { value: 'competency_order', label: 'Order for Competency/Mental Illness Examination', category: 'Post-Conviction' },
];

const CRIM_INTAKE_TYPES = new Set([
  'intake_general','intake_general_spanish','intake_dwi','intake_expunction',
  'engagement_terms','engagement_expunction','auth_release_info','auth_medical_records','auth_hipaa','plea_worksheet',
  'nd_checklist_dwi'
]);

const CRIM_OFFENSES = [
  'DWI 1st','DWI 1st w/Accident','DWI 1st BAC >0.15','DWI 2nd','DWLS / DWLI',
  'Drug Possession','Drug Delivery / Manufacturing','Possession of Marijuana <2oz',
  'Possession of Marijuana 2-4oz','Assault','Assault – Family Violence',
  'Aggravated Assault','Terroristic Threat – Family Violence','Violation of Protective Order',
  'Theft','Robbery','Aggravated Robbery','Burglary of a Motor Vehicle','Burglary',
  'Sexual Assault','Aggravated Sexual Assault','Capital Murder','Murder',
  'Weapons Charge / UCW','Deadly Conduct','Evading Arrest','Resisting Arrest',
  'Failure to Identify','Criminal Mischief','Fraud / White Collar',
  'Tampering with Government Document','Graffiti','Indecent Exposure','Public Lewdness',
  'Community Supervision Violation','Juvenile Matter','Other'
];

const CRIM_COURTS = [
  'County Court at Law','County Criminal Court','District Court',
  'Justice of the Peace','Municipal Court','Federal District Court'
];

const COUNTIES = ['Collin','Dallas','Denton','Ellis','Tarrant','Harris','Travis','Bexar','Other'];

const SENTENCING_CONTEXT = `TEXAS PRESUMPTIVE MISDEMEANOR SENTENCING GUIDELINES:
Class B: Criminal Mischief $100-$750: 6mo prob+$500+restitution or 10d; Disorderly Conduct: 6mo+$500 or 10d; DWLS Non-Fee: 6mo+clearance/insurance or back-time; Evading Arrest: 6mo+$500 or 10d; Failure to Identify: 6mo+$500 or 10d; Marijuana <2oz: dismissal if eligible or memo; Theft $100-$750: 6mo+$500 or 10d; Indecent Exposure: 12mo+$500+DNA+psych eval or 30d.
Class A: Assault FV: 12mo+$500+BIPP+DVIP+no contact+restitution+anger mgmt or 60d; Terroristic Threat FV: 12mo+$500+BIPP+DVIP+no contact or 45d; VPO: 12mo+$500+BIPP+DVIP+no contact or 60d; Assault: 9mo+$500+anger mgmt+no contact or 30d; UCW: 6mo+$500+forfeit weapon or 10d; Theft $750-$2500: 6mo+$500+restitution or 10d.
DWI: 1st: 150/15mo+$1000+interlock+DWI class+VIP+alcohol eval or 3-30d; 1st w/accident: 150/18mo+$1000+interlock or 60d; 1st BAC>0.15: 180/18mo+$1000+mandatory interlock or 60d; 2nd: 365/21mo+$1200+mandatory interlock+repeat DWI class+no alcohol+5d mandatory or 90d.`;

// ── Immigration forms ─────────────────────────────────────────────────────────
const IMMI_FORMS = [
  { value: 'motion_terminate', label: 'Motion to Terminate Removal Proceedings', category: 'Motions' },
  { value: 'motion_continue', label: 'Motion for Continuance (EOIR)', category: 'Motions' },
  { value: 'motion_reopen', label: 'Motion to Reopen (EOIR)', category: 'Motions' },
  { value: 'motion_reconsider', label: 'Motion to Reconsider (EOIR)', category: 'Motions' },
  { value: 'motion_suppress_eoir', label: 'Motion to Suppress Evidence (EOIR)', category: 'Motions' },
  { value: 'motion_change_venue', label: 'Motion for Change of Venue', category: 'Motions' },
  { value: 'lor', label: 'Letter of Representation (EOIR / USCIS)', category: 'Appearances' },
  { value: 'eoir_28', label: 'EOIR-28 Cover Letter', category: 'Appearances' },
  { value: 'g28_cover', label: 'G-28 Cover Letter (USCIS)', category: 'Appearances' },
  { value: 'asylum_declaration', label: 'Client Declaration – Asylum / Withholding', category: 'Declarations' },
  { value: 'cancellation_declaration', label: 'Client Declaration – Cancellation of Removal', category: 'Declarations' },
  { value: 'hardship_declaration', label: 'Hardship Declaration (Qualifying Relative)', category: 'Declarations' },
  { value: 'client_letter_hearing', label: 'Client Letter – Hearing Notice', category: 'Client Letters' },
  { value: 'client_letter_strategy', label: 'Client Letter – Defense Strategy', category: 'Client Letters' },
  { value: 'client_letter_appeal', label: 'Client Letter – BIA Appeal Explanation', category: 'Client Letters' },
  { value: 'client_letter_voluntary', label: 'Client Letter – Voluntary Departure Advisal', category: 'Client Letters' },
  { value: 'brief_cancellation', label: 'Opening Brief – Cancellation of Removal', category: 'Briefs' },
  { value: 'brief_asylum', label: 'Opening Brief – Asylum / Withholding / CAT', category: 'Briefs' },
  { value: 'brief_bia', label: 'BIA Appeal Brief', category: 'Briefs' },
  { value: 'rfe_response', label: 'RFE Response Cover Letter (USCIS)', category: 'USCIS' },
  { value: 'n400_cover', label: 'N-400 Filing Cover Letter', category: 'USCIS' },
  { value: 'foia_dhs', label: 'FOIA / Privacy Act Request – DHS/ICE/CBP', category: 'Discovery' },
  { value: 'bond_motion', label: 'Bond Redetermination Motion (IJ)', category: 'Detention' },
  { value: 'bond_brief', label: 'Bond Hearing Brief', category: 'Detention' },
  { value: 'stay_removal', label: 'Emergency Motion for Stay of Removal', category: 'Detention' },
];

const RELIEF_TYPES = [
  'Asylum','Withholding of Removal','CAT Protection',
  'Cancellation of Removal (LPR)','Cancellation of Removal (Non-LPR)',
  'Adjustment of Status','Voluntary Departure','TPS (Temporary Protected Status)',
  'VAWA','U Visa','Writ of Habeas Corpus','Bond Redetermination',
  'Naturalization (N-400)','Other / Not Applicable'
];

const IMMI_COURTS = [
  'EOIR Immigration Court – Dallas','EOIR Immigration Court – Houston',
  'EOIR Immigration Court – San Antonio','EOIR Immigration Court – El Paso',
  'EOIR Immigration Court – Harlingen','BIA (Board of Immigration Appeals)',
  'USCIS – Dallas Field Office','USCIS – Houston Field Office',
  'USCIS – San Antonio Field Office','U.S. District Court (Habeas)',
  'Fifth Circuit Court of Appeals'
];

const COUNTRIES = [
  'Mexico','Guatemala','Honduras','El Salvador','Venezuela','Cuba','Haiti',
  'Colombia','Ecuador','China','India','Nigeria','Cameroon','Other'
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function groupBy(arr: { value: string; label: string; category: string }[]) {
  return arr.reduce<Record<string, typeof arr>>((acc, f) => {
    acc[f.category] = acc[f.category] || [];
    acc[f.category].push(f);
    return acc;
  }, {});
}

function SelectField({ label, value, onChange, options, placeholder, accent }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string; accent: 'emerald' | 'amber';
}) {
  const ring = accent === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-amber-500';
  const labelColor = accent === 'emerald' ? 'text-emerald-400' : 'text-amber-400';
  return (
    <div>
      <label className={`block text-xs font-semibold ${labelColor} mb-2 uppercase tracking-wide`}>{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className={`w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 pr-10 appearance-none ${ring} focus:border-transparent text-sm`}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// Badge shown when a static (firm-authored) template is available
function StaticBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
      <Check className="w-3 h-3" /> Firm Template
    </span>
  );
}

// ── Criminal Panel ────────────────────────────────────────────────────────────
function CriminalPanel() {
  const [formType, setFormType] = useState('');
  const [offense, setOffense] = useState('');
  const [court, setCourt] = useState('');
  const [county, setCounty] = useState('Collin');
  const [courtNumber, setCourtNumber] = useState('');
  const [causeNo, setCauseNo] = useState('');
  const [defendantName, setDefendantName] = useState('');
  const [additionalFacts, setAdditionalFacts] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<'static' | 'ai' | null>(null);

  const grouped = groupBy(CRIM_FORMS);
  const isIntake = CRIM_INTAKE_TYPES.has(formType);
  const hasStatic = formType in STATIC_TEMPLATES;
  const canGen = formType && (isIntake || hasStatic || defendantName);

  const generate = async () => {
    if (!canGen) return;
    setIsLoading(true);
    setSource(null);
    try {
      // Use embedded firm template if available
      if (hasStatic) {
        const courtLabel = courtNumber ? `${court} No. ${courtNumber}` : court || '[COURT]';
        const text = STATIC_TEMPLATES[formType]({
          defendant: defendantName || '[DEFENDANT NAME]',
          causeNo: causeNo || '[CAUSE NO.]',
          court: courtLabel,
          county,
          offense: offense || '[OFFENSE]',
        });
        setOutput(text);
        setSource('static');
        return;
      }

      // Fall back to AI generation
      const selected = CRIM_FORMS.find(f => f.value === formType);
      const courtLabel = courtNumber ? `${court} No. ${courtNumber}` : court || '[COURT]';
      const prompt = isIntake
        ? `Generate a complete ${selected!.label} for a Texas criminal defense firm. Pre-fill all firm info below. Use blank lines for client-completion fields. Mark as attorney-client privileged where appropriate.
FIRM: ${ATTORNEY.firm} | ${ATTORNEY.name} | ${ATTORNEY.address} | Bar No. ${ATTORNEY.bar} | ${ATTORNEY.phone} | ${ATTORNEY.fax} | ${ATTORNEY.email}
${offense ? `Offense context: ${offense}` : ''}
${additionalFacts ? `Notes: ${additionalFacts}` : ''}
Output the document only — no commentary.`
        : `Generate a Texas criminal defense ${selected!.label} for filing in Texas state court.
ATTORNEY: ${ATTORNEY.name} | ${ATTORNEY.firm} | ${ATTORNEY.address} | Bar No. ${ATTORNEY.bar} | ${ATTORNEY.phone} | ${ATTORNEY.fax} | ${ATTORNEY.email}
Defendant: ${defendantName} | Offense: ${offense || '[OFFENSE]'} | Court: ${courtLabel} | County: ${county} County, Texas | Cause No.: ${causeNo || '[CAUSE NO.]'}
Additional facts: ${additionalFacts || 'None'}
${SENTENCING_CONTEXT}
FORMAT: Use Texas § caption; centered bold/caps title; roman numeral paragraphs; "WHEREFORE, PREMISES CONSIDERED" prayer; full attorney signature block; Certificate of Service via electronic filing manager; [BRACKETS] for variable fields; include ORDER section where appropriate. Output document only.`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      setOutput(data.content?.map((b: { text?: string }) => b.text || '').join('\n').trim() || '');
      setSource('ai');
    } catch { setOutput('Error generating template. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wide">Document Type *</label>
            {hasStatic && <StaticBadge />}
          </div>
          <div className="relative">
            <select value={formType} onChange={e => { setFormType(e.target.value); setOutput(''); setSource(null); }}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 pr-10 appearance-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm">
              <option value="">— Select a document —</option>
              {Object.entries(grouped).map(([cat, items]) => (
                <optgroup key={cat} label={cat}>
                  {items.map(f => (
                    <option key={f.value} value={f.value}>
                      {f.value in STATIC_TEMPLATES ? '★ ' : ''}{f.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {hasStatic && (
            <p className="mt-2 text-xs text-amber-300/70">This document uses your firm's original template.</p>
          )}
        </div>

        {isIntake && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
            <ClipboardList className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300 leading-relaxed">Intake / engagement form — defendant name and case details not required.</p>
          </div>
        )}

        {!isIntake && !hasStatic && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wide">Defendant Full Name *</label>
            <input value={defendantName} onChange={e => setDefendantName(e.target.value)}
              placeholder="e.g. Cody Ray Waddle"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500" />
          </div>
        )}

        {hasStatic && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wide">Defendant Full Name *</label>
            <input value={defendantName} onChange={e => setDefendantName(e.target.value)}
              placeholder="e.g. Cody Ray Waddle"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500" />
          </div>
        )}

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
          <SelectField label={`Offense / Charge${isIntake ? ' (optional)' : ''}`} value={offense} onChange={setOffense}
            options={CRIM_OFFENSES} placeholder="— Select offense —" accent="amber" />
        </div>

        {(!isIntake || hasStatic) && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-3">
            <SelectField label="Court Type" value={court} onChange={setCourt} options={CRIM_COURTS} placeholder="— Select court —" accent="amber" />
            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wide">Court Number</label>
              <input value={courtNumber} onChange={e => setCourtNumber(e.target.value)} placeholder="e.g. 1, 203rd, 380th"
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500" />
            </div>
            <SelectField label="County" value={county} onChange={setCounty} options={COUNTIES} accent="amber" />
            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wide">Cause No.</label>
              <input value={causeNo} onChange={e => setCauseNo(e.target.value)} placeholder="e.g. 380-81895-2013"
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500" />
            </div>
          </div>
        )}

        {!hasStatic && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <label className="block text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wide">
              {isIntake ? 'Additional Notes / Customization' : 'Additional Facts / Legal Arguments'}
            </label>
            <textarea value={additionalFacts} onChange={e => setAdditionalFacts(e.target.value)} rows={4}
              placeholder={isIntake ? 'Any specific sections or language to include...' : 'Key facts, statutory basis, Brady-specific requests, investigator name, etc.'}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 resize-none text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-500" />
          </div>
        )}

        <button onClick={generate} disabled={isLoading || !canGen}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200">
          {isLoading
            ? <><div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Drafting...</>
            : hasStatic
              ? <><FileText className="w-5 h-5" />Load Firm Template</>
              : <><Sparkles className="w-5 h-5" />Generate Template</>}
        </button>
      </div>

      <OutputPanel output={output} copied={copied} source={source}
        onCopy={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        accent="amber" />
    </div>
  );
}

// ── Immigration Panel ─────────────────────────────────────────────────────────
function ImmigrationPanel() {
  const [formType, setFormType] = useState('');
  const [relief, setRelief] = useState('');
  const [court, setCourt] = useState('');
  const [clientName, setClientName] = useState('');
  const [aNumber, setANumber] = useState('');
  const [country, setCountry] = useState('');
  const [additionalFacts, setAdditionalFacts] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const grouped = groupBy(IMMI_FORMS);

  const generate = async () => {
    if (!formType || !clientName) return;
    setIsLoading(true);
    try {
      const selected = IMMI_FORMS.find(f => f.value === formType);
      const prompt = `You are a Texas immigration defense attorney at ${ATTORNEY.firm} drafting a ${selected!.label} for use before EOIR immigration courts, the BIA, USCIS, or federal courts in the Fifth Circuit.
FIRM: ${ATTORNEY.firm} | ${ATTORNEY.name} | ${ATTORNEY.address} | Bar No. ${ATTORNEY.bar} | ${ATTORNEY.phone} | ${ATTORNEY.fax} | ${ATTORNEY.email}
Client: ${clientName} | A-Number: ${aNumber || '[A-NUMBER]'} | Country of Origin: ${country || '[COUNTRY]'} | Relief Sought: ${relief || 'unspecified'} | Forum: ${court || '[COURT/FORUM]'}
Additional facts: ${additionalFacts || 'None'}
Requirements: Follow INA, 8 C.F.R., and applicable Fifth Circuit/BIA precedent. Use proper EOIR/USCIS caption conventions. Use [BRACKETS] for variable fields. Include signature block, certificate of service, and/or proof of filing as appropriate. Output document only — no commentary.`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      setOutput(data.content?.map((b: { text?: string }) => b.text || '').join('\n').trim() || '');
    } catch { setOutput('Error generating template. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
          <label className="block text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Document Type *</label>
          <div className="relative">
            <select value={formType} onChange={e => { setFormType(e.target.value); setOutput(''); }}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 pr-10 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
              <option value="">— Select a document —</option>
              {Object.entries(grouped).map(([cat, items]) => (
                <optgroup key={cat} label={cat}>
                  {items.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Client Name *</label>
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Maria Elena Ramirez"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">A-Number</label>
            <input value={aNumber} onChange={e => setANumber(e.target.value)} placeholder="e.g. A 123 456 789"
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-3">
          <SelectField label="Country of Origin" value={country} onChange={setCountry} options={COUNTRIES} placeholder="— Select country —" accent="emerald" />
          <SelectField label="Relief Sought" value={relief} onChange={setRelief} options={RELIEF_TYPES} placeholder="— Select relief —" accent="emerald" />
          <SelectField label="Court / Forum" value={court} onChange={setCourt} options={IMMI_COURTS} placeholder="— Select court —" accent="emerald" />
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
          <label className="block text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Additional Facts / Notes</label>
          <textarea value={additionalFacts} onChange={e => setAdditionalFacts(e.target.value)} rows={4}
            placeholder="Key facts, hearing dates, qualifying relatives, country conditions, legal arguments..."
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 resize-none text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-500" />
        </div>

        <button onClick={generate} disabled={isLoading || !formType || !clientName}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200">
          {isLoading ? <><div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Drafting...</> : <><Sparkles className="w-5 h-5" />Generate Template</>}
        </button>
      </div>

      <OutputPanel output={output} copied={copied} source={null}
        onCopy={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        accent="emerald" />
    </div>
  );
}

// ── Shared Output Panel ───────────────────────────────────────────────────────
function OutputPanel({ output, copied, onCopy, accent, source }: {
  output: string; copied: boolean; onCopy: () => void;
  accent: 'emerald' | 'amber'; source: 'static' | 'ai' | null;
}) {
  const iconColor = accent === 'emerald' ? 'text-emerald-400' : 'text-amber-400';
  return (
    <div className="lg:col-span-3">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl flex flex-col" style={{ minHeight: '600px' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <FileText className={`w-5 h-5 ${iconColor}`} />
            <span className="font-semibold text-white text-sm">Document Output</span>
            {source === 'static' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Firm Template
              </span>
            )}
            {source === 'ai' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600 font-medium">
                AI Generated
              </span>
            )}
          </div>
          {output && (
            <button onClick={onCopy} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
              {copied ? <><Check className="w-4 h-4 text-green-400" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}
            </button>
          )}
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {output ? (
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed">{output}</pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Scale className="w-14 h-14 mb-4 opacity-20 text-slate-500" />
              <p className="text-base font-medium text-slate-400">No template generated yet</p>
              <p className="text-sm mt-2 max-w-xs text-slate-500">Fill in the fields and click Generate.</p>
              <div className="mt-6 text-xs text-slate-600 border border-slate-700 rounded-lg px-4 py-3 max-w-sm text-left leading-relaxed">
                <span className="text-slate-500 font-semibold block mb-1">⚠️ Filing Disclaimer</span>
                Templates are starting points. Always review for accuracy and compliance with applicable court rules before filing.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('criminal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tab === 'criminal' ? 'bg-amber-500/20 border-amber-500/40' : 'bg-emerald-500/20 border-emerald-500/40'}`}>
            <Scale className={`w-6 h-6 ${tab === 'criminal' ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{ATTORNEY.firm}</h1>
            <p className="text-slate-400 text-xs mt-0.5">{ATTORNEY.name} · Bar No. {ATTORNEY.bar} · Plano, Texas</p>
          </div>
          <div className="ml-auto text-xs text-slate-500 border border-slate-700 rounded-lg px-3 py-1">
            {tab === 'criminal' ? 'TX State Criminal' : 'EOIR · BIA · USCIS · 5th Cir.'}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-4 flex gap-2">
          <button onClick={() => setTab('criminal')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'criminal' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            ⚖️ Criminal Defense
          </button>
          <button onClick={() => setTab('immigration')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'immigration' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            🌐 Immigration Defense
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'criminal' ? <CriminalPanel /> : <ImmigrationPanel />}
      </div>
    </div>
  );
}
