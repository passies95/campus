# Generated by Django 4.2.6 on 2024-03-30 14:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('campusfront', '0007_department_office_department_officeid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='officeID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='campusfront.office'),
        ),
    ]