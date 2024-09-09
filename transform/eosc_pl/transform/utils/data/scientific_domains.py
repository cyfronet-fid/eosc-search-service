"""Normalize Rodbuk's scientific domains"""

from collections import defaultdict

from pandas import DataFrame

from eosc_pl.mappings.scientific_domains import mp_sd_structure, oecd_mapping


def harvest_scientific_domains(df: DataFrame) -> list[list[str]] | list[str]:
    """Harvest scientific domains from oecd - Rodbuk resources.
    Then, map it into MP's scientific_domains"""

    def map_scientific_domain(sd_raw: str, sd_list: list[str]) -> list[str] | None:
        """Map scientific domain"""
        try:
            sd_trimmed = sd_raw
            sd_mapped = oecd_mapping[sd_trimmed]

            if ">" in sd_mapped:  # If a child is being added
                if sd_mapped not in sd_list:
                    # Assumption: trusting the data to automatically assign parents to individual children.
                    # Looking at the results, we actually have the most happy paths here.
                    # When we previously added a child along with their parent,
                    # there were almost always more parents than children, and there were definitely fewer happy paths.
                    return [sd_mapped]
                return None
            else:  # If a parent is being added
                return [sd_mapped]
        except KeyError:
            if sd_raw != "null":
                print(
                    f"Unexpected scientific domain: {sd_raw}, trimmed version: {sd_raw}"
                )
            return None  # Don't add unexpected scientific domain to not destroy filter's tree structure

    def count_scientific_domain(sd_list: list[str]) -> (defaultdict, defaultdict):
        """Count actual and expected numbers of parents in scientific domain row"""
        actual_p = defaultdict(int)
        expected_p = defaultdict(int)

        for sd in sd_list:
            if ">" not in sd:  # Parent
                if sd in mp_sd_structure.keys():  # It was successfully mapped
                    actual_p[sd] += 1
                else:  # Skip not mapped ones
                    continue
            else:  # Child
                for mp_parent, mp_children in mp_sd_structure.items():
                    if sd in mp_children:
                        expected_p[mp_parent] += 1

        return actual_p, expected_p

    def adjust_scientific_domain(
        sd_list: list[str], actual_p: defaultdict, expected_p: defaultdict
    ) -> None:
        """Adjust scientific domains. There is a need to apply the same logic as PC does.
        Unfortunately, we cannot enforce anything during onboarding process as they do,
        so we need to deal with any case here.
        PC's Assumptions:
        - scientific domains have 2 levels. Parent -> children depth only,
        - you can set only child scientific domain for your resource (parent only is not allowed),
        - if you set a scientific domain for your resource, you always add also its parent. Always (child, parent) pairs
        - sd children cannot be duplicated,
        - sd parents can be duplicated, and they are duplicated a lot!
        Abbreviations for rules:
         - number of the same parent strings -> p
         - number of children of the same parent -> ch
        Rules how to satisfy PC's assumptions in our cases:
            For each resource we need to check its every sd parent whether PC's assumptions are satisfied.
            Cases:
                1) p == ch -> do nothing (happy path),
                2) p > ch -> delete as many parents to the point where p == ch,
                3) ch > p -> add as many parents to the point where p == ch,
                4) p > 0, ch == 0 -> delete this parent string/strings, but add all his children + parent pairs.
                   In other words, when there are only parents without children, add all their (child, parent) pairs,
                   but keep p == ch satisfied - so delete those initial parent strings.
        """

        def remove_n_occurrences(lst: list[any], elem: any, n: int) -> None:
            """Remove n occurrences of certain element in a list"""
            count = 0
            while n > count and elem in lst:
                lst.remove(elem)
                count += 1

        def remove_all_occurrences(lst: list[any], elem: any) -> None:
            """Remove all occurrences of certain element in a list"""
            while elem in lst:
                lst.remove(elem)

        for exp_parent, exp_num_of_parents in expected_p.items():
            for act_parent, act_num_of_parents in actual_p.items():
                if exp_parent == act_parent:
                    if (
                        exp_num_of_parents == act_num_of_parents
                    ):  # Case 1) - happy path - no action needed.
                        break
                    elif (
                        act_num_of_parents > exp_num_of_parents
                    ):  # Case 2) - delete excessive parents
                        difference = act_num_of_parents - exp_num_of_parents
                        remove_n_occurrences(sd_list, exp_parent, difference)
                        actual_p[act_parent] -= difference
                        break
                    elif (
                        act_num_of_parents < exp_num_of_parents
                    ):  # Case 3) - add additional parents
                        difference = exp_num_of_parents - act_num_of_parents
                        sd_list.extend([exp_parent] * difference)
                        actual_p[act_parent] += difference
                        break
            else:
                # Parent exists in expected data, but does not exist in an actual data
                sd_list.extend([exp_parent] * exp_num_of_parents)
                actual_p[exp_parent] += exp_num_of_parents

        # Case 4) - if there are more parents in actual data than expected
        if len(actual_p.keys()) != len(expected_p.keys()):
            difference = set(actual_p.keys()) ^ set(expected_p.keys())
            for parent in difference:
                # Delete all occurrences of that parent from scientific domain row
                remove_all_occurrences(sd_list, parent)
                # Add all its children + the parent itself as a pairs
                for child in mp_sd_structure[parent]:
                    sd_list.extend([child, parent])

                actual_p[parent] = len(mp_sd_structure[parent])
                expected_p[parent] = len(mp_sd_structure[parent])

    def check_mapping() -> None:
        """Check the accuracy of mapping"""
        (
            final_actual_parents_ctx,
            final_expected_parents_ctx,
        ) = count_scientific_domain(sd_row)
        if not (
            final_actual_parents_ctx == actual_parents_ctx
            and final_expected_parents_ctx == expected_parents_ctx
        ):
            error_stats = {
                "Final row": sd_row,
                "Actual from process": actual_parents_ctx,
                "Actual from check": final_actual_parents_ctx,
                "Expected from process": expected_parents_ctx,
                "Expected from check": final_expected_parents_ctx,
            }
            raise AssertionError(
                f"The mapping of scientific domains for a ceratin resource was not completely successful. Some values may be missing or incorrect. See: {error_stats}"
            )

    def create_raw_sd_column() -> list[list[int]]:
        """Create raw scientific column from Rodbuk's 'oecd' nested field"""
        raw_sd_list = []
        for row in df["metadataBlocks"]:
            for field in row["citation"]["fields"]:
                sd_row = []
                if field["typeName"] == "oecd":  # scientific domain property
                    for val in field["value"]:
                        sd_row.append(int(val["oecdList"]["value"]))
                    raw_sd_list.append(sd_row)
                    break
            else:
                raw_sd_list.append([])
        return raw_sd_list

    raw_sd_column = create_raw_sd_column()
    scientific_domain_column = []
    for raw_sd in raw_sd_column:
        try:
            sd_row = []
            if raw_sd:
                for sd in raw_sd:
                    final_sd = map_scientific_domain(sd, sd_row)
                    if final_sd:
                        sd_row.extend(final_sd)

                actual_parents_ctx, expected_parents_ctx = count_scientific_domain(
                    sd_row
                )
                adjust_scientific_domain(
                    sd_row, actual_parents_ctx, expected_parents_ctx
                )
                scientific_domain_column.append(sd_row)
                check_mapping()

            else:
                scientific_domain_column.append([])
        except (TypeError, ValueError):
            scientific_domain_column.append([])

    return scientific_domain_column
