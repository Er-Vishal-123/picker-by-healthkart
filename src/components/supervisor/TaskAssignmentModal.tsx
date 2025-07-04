
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { RealTimePicker } from '@/hooks/useRealTimePickers';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (task: any) => void;
  pickers: RealTimePicker[];
  isLoading: boolean;
}

const TaskAssignmentModal = ({ isOpen, onClose, onAssign, pickers, isLoading }: TaskAssignmentModalProps) => {
  const [selectedPicker, setSelectedPicker] = useState('');
  const [taskType, setTaskType] = useState('pick_list');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPicker) return;

    const task = {
      picker_id: selectedPicker,
      task_type: taskType,
      priority,
      due_date: dueDate?.toISOString(),
      notes: notes.trim() || null,
      status: 'assigned',
    };

    onAssign(task);
    
    // Reset form
    setSelectedPicker('');
    setTaskType('pick_list');
    setPriority('medium');
    setDueDate(undefined);
    setNotes('');
    onClose();
  };

  const availablePickers = pickers.filter(p => p.status !== 'offline');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="picker">Select Picker</Label>
            <Select value={selectedPicker} onValueChange={setSelectedPicker}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a picker" />
              </SelectTrigger>
              <SelectContent>
                {availablePickers.map((picker) => (
                  <SelectItem key={picker.id} value={picker.id}>
                    {picker.name} ({picker.status}) - {picker.inProgress} active tasks
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskType">Task Type</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pick_list">Pick List</SelectItem>
                <SelectItem value="inventory_check">Inventory Check</SelectItem>
                <SelectItem value="quality_control">Quality Control</SelectItem>
                <SelectItem value="special_order">Special Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Select due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedPicker || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLoading ? 'Assigning...' : 'Assign Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;
