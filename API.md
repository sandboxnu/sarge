# HackNU API 

## Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/orgs` | Create a new organization |
| `GET` | `/orgs/{id}` | Get organization by ID |
| `PUT` | `/orgs/{id}` | Update organization details |
| `DELETE` | `/orgs/{id}` | Delete organization |
| `GET` | `/orgs/{id}/users` | Get all users in organization |
| `GET` | `/orgs/{id}/positions` | Get all positions for organization |

## Users & Roles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Create a new user |
| `GET` | `/users/{id}` | Get user by ID |
| `PUT` | `/users/{id}` | Update user details |
| `DELETE` | `/users/{id}` | Delete user |
| `POST` | `/users/{id}/roles` | Assign role to user |
| `GET` | `/users/{id}/roles` | Get user's roles |
| `DELETE` | `/users/{id}/roles/{roleId}` | Remove role from user |

## Positions & Candidate Pools

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/positions` | Create a new position |
| `GET` | `/positions/{id}` | Get position details |
| `PUT` | `/positions/{id}` | Update position |
| `DELETE` | `/positions/{id}` | Delete position |
| `GET` | `/positions` | List positions (paginated) |
| `POST` | `/positions/{id}/candidates` | Add candidates to position (batch or single) |
| `GET` | `/positions/{id}/candidates` | Get candidates for position (paginated) |
| `DELETE` | `/positions/{id}/candidates/{candidateId}` | Remove candidate from position (batch or single) |
| `GET` | `/positions/{id}/candidate-pool` | Get candidate pool details |

## Candidates

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/candidates` | Create a new candidate |
| `PUT` | `/candidates/{id}` | Update candidate information |
| `DELETE` | `/candidates/{id}` | Delete candidate |
| `GET` | `/candidates/{id}/assessments` | Get all assessments for candidate |

## Task Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/task-templates` | Create a new task template |
| `GET` | `/task-templates/{id}` | Get task template details |
| `PUT` | `/task-templates/{id}` | Update task template |
| `DELETE` | `/task-templates/{id}` | Delete task template |
| `GET` | `/task-templates` | List task templates (paginated?) |
| `POST` | `/task-templates/{id}/tags` | Add tags to task template |
| `DELETE` | `/task-templates/{id}/tags/{tagId}` | Remove tag from task template |

## Assessment Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assessment-templates` | Create assessment template |
| `GET` | `/assessment-templates/{id}` | Get assessment template |
| `PUT` | `/assessment-templates/{id}` | Update assessment template |
| `DELETE` | `/assessment-templates/{id}` | Delete assessment template |
| `GET` | `/assessment-templates` | List assessment templates (paginated?) |
| `POST` | `/assessment-templates/{id}/tasks` | Add task to assessment template |
| `DELETE` | `/assessment-templates/{id}/tasks/{taskId}` | Remove task from assessment template |

## Assessments & Distribution

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assessments` | Create new assessment from template for candidate |
| `GET` | `/assessments/{id}` | Get assessment details and status |
| `PUT` | `/assessments/{id}` | Update assessment |
| `DELETE` | `/assessments/{id}` | Delete assessment |
| `POST` | `/assessments/distribute` | Create assessments for all candidates in position |
| `POST` | `/assessments/{id}/submit` | Mark assessment as submitted by candidate |
| `GET` | `/assessments/{id}/tasks` | Get all tasks for this assessment |
| `GET` | `/assessments` | List assessments (with candidate and status filters) |

## Tasks & Code Execution

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks/{id}` | Get task details (includes candidate_code if exists) |
| `POST` | `/tasks/{id}/execute` | Run candidate code against public test cases |
| `PUT` | `/tasks/{id}/code` | Save candidate's code to task.candidate_code |
| `POST` | `/tasks/{id}/submit` | Run against all test cases and update last_updated |
| `GET` | `/tasks/{id}/results` | Get latest execution results |

## Reviews & Scoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tasks/{id}/reviews` | Create review for task |
| `GET` | `/tasks/{id}/reviews` | Get all reviews for task |
| `PUT` | `/reviews/{id}` | Update review/score |
| `DELETE` | `/reviews/{id}` | Delete review |

## Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tasks/{taskId}/comments` | Add comment to task |
| `GET` | `/tasks/{taskId}/comments` | Get comments for task |
| `PUT` | `/comments/{id}` | Update comment |
| `DELETE` | `/comments/{id}` | Delete comment |
| `POST` | `/assessments/{assessmentId}/comments` | Add comment to assessment |
| `GET` | `/assessments/{assessmentId}/comments` | Get comments for assessment |

## Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tags` | Create new tag |
| `GET` | `/tags` | List all tags |
| `GET` | `/tags/{id}` | Get tag details |
| `PUT` | `/tags/{id}` | Update tag |
| `DELETE` | `/tags/{id}` | Delete tag |
