import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  @Input() overdueTaskList: Task[] | undefined = [];
  @Input() progressTasksList: Task[] | undefined = [];
  @Input() completeTasksList: Task[] | undefined = [];
  @Output() taskSelected = new EventEmitter<Task>();
  @Output() updateStage = new EventEmitter<Task>();

  selectTask(task: Task) {
    this.taskSelected.emit(task);
  }

  constructor() {}

  ngOnInit(): void {}

  getTasks(): void {}

  

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'red';
      case 'mid':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'bisque';
    }
  }
}
