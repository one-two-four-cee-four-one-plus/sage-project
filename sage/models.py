from django.db import models
from django.core.files.storage import FileSystemStorage
from django.conf import settings


class BaseComponent:

    @property
    def html(self):
        raise NotImplementedError()


class Component(models.Model, BaseComponent):
    related = models.ManyToManyField('self',
                                     through='ComponentRelationship',
                                     through_fields=('left', 'right'))


class Origin(models.Model):
    pass


class TextOrigin(Origin):
    offset = models.PositiveIntegerField()
    length = models.PositiveIntegerField()

    
class ComponentRelationship(models.Model):
    left = models.ForeignKey(Component,
                             related_name='left',
                             on_delete=models.CASCADE)
    right = models.ForeignKey(Component,
                              related_name='right',
                              on_delete=models.CASCADE)
    how = models.OneToOneField(Origin, on_delete=models.CASCADE)


class TextComponent(Component):
    content = models.TextField()

    @property
    def html(self):
        return f'{self.content}'


class MediaTypes(models.TextChoices):
    UNKNOWN = '?'
    JPEG = 'jpeg'
    PNG = 'png'
    GIF = 'gif'


media_storage = FileSystemStorage(
    location=f'{settings.BASE_DIR}/media/',
    base_url=f'/media/'
)


class MediaComponent(Component):
    
    media_type = models.CharField(
        max_length=100,
        choices=MediaTypes.choices,
        default=MediaTypes.UNKNOWN
    )

    file = models.FileField(
        storage=media_storage
    )
