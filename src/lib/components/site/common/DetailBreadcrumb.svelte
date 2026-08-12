<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

	interface Props {
		collectionHref: string;
		collection: string;
		subSubject: string;
	}

	let { collectionHref, collection, subSubject }: Props = $props();
</script>

<Breadcrumb.Root aria-label="Breadcrumb" data-detail-breadcrumb>
	<Breadcrumb.List>
		<Breadcrumb.Item><Breadcrumb.Link href="https://lab.sa">LAB</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item><Breadcrumb.Link href={collectionHref}>{collection}</Breadcrumb.Link></Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item><Breadcrumb.Page>{subSubject}</Breadcrumb.Page></Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
