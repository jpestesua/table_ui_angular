# Upload changes to github
push:
	@echo "Push changes to github"
	git add -A
	-git commit -m '$(shell date) ||| ${c}'
	git push