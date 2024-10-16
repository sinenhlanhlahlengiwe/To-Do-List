import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  tasks: Task[] = [];
  inProgress: Task[] = [];
  overdue: Task[] = [];
  complete: Task[] = [];

  email: string | null = '';
  isTaskSelected = false;
  selectedTask: Task | undefined;
  user?: User;
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    const taskData = localStorage.getItem('tasks');
    this.tasks = taskData ? JSON.parse(taskData) : [];
    this.email = localStorage.getItem('email');
    if (!this.email) {
      this.router.navigate(['/login']);
    }
    this.user = {
      email: localStorage.getItem('email')
        ? localStorage.getItem('email')
        : ' ',
      name: localStorage.getItem('email') ? localStorage.getItem('email') : '',
    };

    this.inProgress = this.tasks.filter((task) => {
      return task.stage.toLowerCase() === 'in-progress';
    });
    this.overdue = this.inProgress.filter((task) => {
      return new Date(task.deadline) <= new Date();
    });

    this.overdue.forEach((task) => {
      const index = this.inProgress.findIndex(
        (existingTask) => existingTask.title === task.title
      );
      if (index !== -1) {
        this.inProgress.splice(index, 1);
      }
    });
    this.complete = this.tasks.filter((task) => {
      return task.stage.toLowerCase() === 'complete';
    });
  }
  onTaskSelected(task: Task) {
    this.isTaskSelected = true;
    this.selectedTask = task;
  }
  async updateStage(taskData: any) {
    const reqBody = {
      username: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
      task: taskData,
    };
    const response: any = await this.http
      .post('http://localhost:3000/update', reqBody)
      .toPromise();
    console.log('Task updated successfully:', response);
    await alert('You have successfully updated a task');
    localStorage.setItem('tasks', JSON.stringify(response.userDataNew.tasks));
    this.closeTaskDetailPopup();
    this.router.navigate(['/dashboard']);
  }
  onStageChanged(task: Task) {
    this.updateStage({ stage: task.stage, id: task.id, title: task.title });
  }
  closeTaskDetailPopup() {
    this.isTaskSelected = false;
    this.selectedTask = undefined;
  }
  isFormVisible = false;

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }
  async registerUser(userData: User) {
    const response = await this.http
      .post('http://localhost:3000/Newuser', userData)
      .toPromise();
    console.log('User created successfully:', response);
    alert(`You have successfully created a new User ${userData.name}`);
  }
  async createNewTask(taskData: Task) {
    const reqBody = {
      username: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
      task: taskData,
    };

    const response: any = await this.http
      .post('http://localhost:3000/NewTask', reqBody)
      .toPromise();
    console.log('Task created successfully:', response);
    await alert('You have successfully created a new task');
    localStorage.setItem('tasks', JSON.stringify(response.userDataNew.tasks));
    this.router.navigate(['/dashboard']);
    return;
  }

  addTask(task: Task) {
    task.id = 0;
    this.createNewTask(task);

    this.hideForm();
  }
}
