type ArchitectureSource = {
	owner: string;
	repository: string;
	architectureId: string;
};

const defaultBranch = 'main';

export const getLatestArchitectureSourceUrl = ({
	owner,
	repository,
	architectureId,
}: ArchitectureSource) =>
	`https://github.com/${owner}/${repository}/tree/${defaultBranch}/architectures/${architectureId}`;
