import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent {
  @Input() taskSelected: Task | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() updateStage = new EventEmitter<Task>();

  closeTask() {
    this.close.emit();
  }
  updateTaskStage(newStatus: string): void {
    if (this.taskSelected) {
      this.taskSelected.stage = newStatus;
    }
    
    this.updateStage.emit(this.taskSelected);
  }
}
