	create trigger Tran
	on PULPIT after INSERT, DELETE, UPDATE
	as
	    declare @c int = (select count (*) from PULPIT);
	 if (@c >22)
	 begin
        raiserror('Общая количество кафедр не может быть >22', 10, 1);
	    rollback;
	 end;
	 return;

    go

