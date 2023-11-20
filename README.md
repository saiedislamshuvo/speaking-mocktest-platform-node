# IELTS Speaking Mocktest Platform APIs
A platform where people can find an IELTS speaking partner and take an IELTS speaking mock test. There should be an evolution for every mock test, and the mock test will be participated by the trainer who recruits from an organization or individual. End-users have evaluation progress and details of every mock test data.


## Installation

### Project setup
```
yarn install
mv .env.example .env
// provide necessary variables in env file then run
yarn dev
```

### API Documentation

```
GET HOST::PORT/docs
```
## Relationship
- A user can be a trainer or an admin.
- A trainer belongs to one organization.
- An organization can have many trainers.
- A user can schedule a mocktest.
- A mocktest can be assigned to a trainer or an organization.
- A trainer or organization can accept or decline a mocktest request.
- A trainer or organization can provide feedback for a mocktest.


## Bird Eye View
```
A[User] --> B{Login or Register}
B --> C{Request Trainer or Create Mocktest}
C --> D{Find Trainer or Organization}
D --> E{Accept or Decline Request}
E --> F{Schedule Mocktest and Send Meeting Link}
F --> G{User Attends Mocktest}
G --> H{Trainer or Organization Provides Feedback}
H --> I[End]
```
```
A[Trainer] --> B{Receive Mocktest Request}
B --> C{Check Availability}
C --> D{Accept or Decline Request}
D --> E[Schedule Mocktest and Send Meeting Link]
E --> F{Conduct Mocktest}
F --> G{Provide Feedback}
G --> H[End]
```
```
A[Organization] --> B{Receive Mocktest Request}
B --> C{Check Trainer Availability}
C --> D{Accept or Decline Request}
D --> E[Schedule Mocktest and Send Meeting Link]
E[Assign Trainer] --> F[End]
```

## Requirements

### User Process
Login or Register: Users can either login to an existing account or create a new one.

Request a Trainer: Users can request a trainer by submitting a minimum result.

Create Organization: Users can create an organization to manage their trainers and mock interview schedules.

Create a Schedule for Practice: Users can create a practice schedule to help them prepare for their IELTS exam.

Update Bio, Target Score: Users can update their bio and target score to provide more information to trainers and organizations.

View Previous IELTS Exam Results: Users can view their previous IELTS exam results to track their progress.

Request a Scheduled (Mock Interview): Users can request a scheduled mock interview with a specific trainer or organization. They will need to be on time for the trainer's timetable.

Receive Notification of Meeting Link: If the trainer accepts the mock interview request, a meeting link will be generated and sent to the user.

View List of Mock Interview Requests and Details: Users can view a list of their mock interview requests and their details.

View Statistics of Mocktest Requests, Feedback, Band Scores: Users can view statistics of their mocktest requests, feedback, highest band scores, targeted band scores, and last mocktest results.

Review Mocktest Interview: Users can review their mocktest interviews after they have been completed.

### Trainer Process
Belong to One Organization: Trainers can only belong to one organization at a time.

View List of Interviews: Trainers can view a list of interviews and filter them by parameters such as organization, individual, upcoming, and previous.

Post Feedback to Interviews: Trainers can post feedback to mock interviews after they have been completed.

Accept or Reject Mocktest Requests: Trainers can accept or reject mocktest requests from users.

View Schedule and Timetable: Trainers can view their schedule and timetable to see their availability for mock interviews.

View Balance and Request Withdrawal: Trainers can view their balance and request to withdraw funds.

Receive Withdrawal Request Approval: Trainers will be notified once their withdrawal request has been approved and the funds have been transferred.

Receive Notifications Regarding Timetable Updates: Trainers will receive notifications if they need to update their timetables.

Organization Process
Set Up Timetable: Organizations need to set up their timetables when they are open for business.

Add Trainers and Timetables: Organizations can add trainers and their timetables to their organization's timetable.

Verification Process: Organizations need to be verified before they can start offering mock interview services.

View List of Mocktests: Organizations can view a list of mocktests that are scheduled for their organization.

Assign Mocktests to Trainers: Organizations can assign mocktests to their trainers. Trainers need to accept the assignment.

Check Trainer Timetable Availability: Organizations can check the availability of their trainers before assigning mocktests.

Update Trainer Timetables: If the organization sets trainer timetables, trainers need to update their timetables accordingly.

Request Withdrawal: Organizations can request to withdraw funds.

View Withdrawal Details: Organizations can view their withdrawal details, including total income, withdrawable income, total withdrawn, and withdrawn pending.

### Admin Process
CRUD User: Admins can create, read, update, and delete user accounts.

CRUD Trainer: Admins can create, read, update, and delete trainer accounts.

Approve or Block Trainers: Admins can approve or block trainers based on their performance and conduct.

View Trainer Organization Affiliation: Admins can view which organization a trainer belongs to.

CRUD Organization: Admins can create, read, update, and delete organization accounts.

Approve or Block Organizations: Admins can approve or block organizations based on their verification status and compliance with guidelines.

View Organization Trainer List: Admins can view the list of trainers associated with an organization.

View Scheduled Mocktests: Admins can view a list of scheduled mocktests.

View Mocktest Details and Feedback: Admins can view the details of mocktests and the feedback provided by trainers.

View User Profiles: Admins can view user profiles, including their results, mocktests, and details.

View Trainer Profiles: Admins can view trainer profiles, including their mocktest