from django.db.models.signals import post_delete
from django.dispatch import receiver
from cleverminer_tasks.models import Dataset


@receiver(post_delete, sender=Dataset)
def delete_dataset_file(sender, instance: Dataset, **kwargs):
    if instance.file and instance.file.name:
        instance.file.delete(save=False)
