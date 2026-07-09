import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TopicCard from './TopicCard';

export function SortableTopicCard({ topic, onDelete, onMarkDone }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TopicCard {...topic} onDelete={onDelete} onMarkDone={onMarkDone} />
    </div>
  );
}